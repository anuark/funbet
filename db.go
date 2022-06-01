package main

import (
	"context"
	"fmt"
	"github.com/icrowley/fake"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"math/rand"
	"os"
	"time"
)

func GetDb() *mongo.Database {
	// Create a new client and connect to the server
	fmt.Println(os.Getenv("MONGO_URL"))
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URL")))
	if err != nil {
		panic(err)
	}
	// Ping the primary
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	// fmt.Println("Successfully connected and pinged.")

	return client.Database("funbet")
}

func DisconnectDb(client *mongo.Client) {
	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}

func GenerateData(db *mongo.Database) {
	playersColl := db.Collection("players")
	filter := bson.D{{"_id", bson.D{{"$exists", true}}}}

	// clean up
	playersColl.DeleteMany(context.TODO(), filter)
	for i := 0; i < 10; i++ {
		player := Player{
			Name:   fake.FirstName(),
			Points: 0,
		}
		_, err := playersColl.InsertOne(context.TODO(), player)
		if err != nil {
			fmt.Println(err)
		}
	}

	matchesColl := db.Collection("matches")

	// clean up
	matchesColl.DeleteMany(context.TODO(), filter)

	// Fill data
	for i := 0; i < 10; i++ {
		// nextWeek := time.Duration(int(time.Hour) * 24 * 7 * i)
		nextWeek := time.Duration(int(time.Minute) * 1 * i)
		match := Match{
			HomeTeam:      fake.Brand(),
			AwayTeam:      fake.Brand(),
			HomeScore:     rand.Intn(5),
			AwayScore:     rand.Intn(5),
			MatchDate:     time.Now().Add(nextWeek),
			HomePlayerIds: []int{},
			AwayPlayerIds: []int{},
		}
		matchesColl.InsertOne(context.TODO(), match)
	}

	// Generate player votes
	for i := 0; i < 10; i++ {
		// shuffle player ids that goes from 0 - 9 same as matches aswell
		a := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(a), func(i, j int) { a[i], a[j] = a[j], a[i] })
		for j, v := range a {
			if j%2 == 0 {
				matchesColl.UpdateOne(context.TODO(), bson.D{{"id", i}}, bson.D{{"$push", bson.D{{"home_player_ids", v}}}})
			} else {
				matchesColl.UpdateOne(context.TODO(), bson.D{{"id", i}}, bson.D{{"$push", bson.D{{"away_player_ids", v}}}})
			}
		}
	}

	fmt.Println("successfully generated test data")
}
