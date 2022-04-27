package main

import (
	"context"
	"fmt"
    "os"
	"github.com/icrowley/fake"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"math/rand"
)

func NewMongoConnection() *mongo.Client {
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URL")))
	if err != nil {
		panic(err)
	}
	// Ping the primary
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected and pinged.")

	return client
}

func DisconnectDb(client *mongo.Client) {
	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
	fmt.Println("Successfully disconnected.")
}

func GenerateData(client *mongo.Client) {
	playersCol := client.Database("funbet").Collection("players")
	filter := bson.D{{"_id", bson.D{{"$exists", true}}}}
	// filter := bson.D{{"_id", bson.D{{"$gt", 8}}}}
	playersCol.DeleteMany(context.TODO(), filter)
	for i := 0; i < 10; i++ {
		player := Player{Name: fake.FirstName()}
		_ = player
		// _, err := playersCol.InsertOne(context.TODO(), player)
		// if err != nil {
		//     fmt.Println(err)
		// }
	}

	// Fill data
	var matches []Match
	for i := 0; i < 10; i++ {
		matches = append(matches, Match{
			HomeTeam:  fake.Brand(),
			AwayTeam:  fake.Brand(),
			HomeScore: rand.Intn(5),
			AwayScore: rand.Intn(5),
		})
	}
	_ = matches
	// fmt.Println(matches)
}
