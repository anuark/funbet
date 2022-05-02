package main

import (
	"context"
	"flag"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "time"
	// "github.com/icrowley/fake"
	// "math/rand"
	"github.com/joho/godotenv"
)

func main() {
	// env
	// fix calling this piece of shit
	ctx := context.Background()
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	// db
	db := GetDb()
	defer DisconnectDb(db.Client())

	// cmd flags
	generate := flag.Bool("g", false, "generate data")
	action := flag.String("a", "", "action function")
	actionParams := flag.String("params", "{}", "action parameters")
	flag.Parse()

	if *generate {
		GenerateData(db)
	}

	switch *action {
	case "list_players":
		playersColl := db.Collection("players")
		opts := options.Find().SetSort(bson.D{{"points", -1}})
		playersCur, err := playersColl.Find(ctx, bson.D{}, opts)
		if err != nil {
			panic(err)
		}

		var players []Player
		playersCur.All(ctx, &players)
		PrintPlayers(players)
	case "place_bet":
		fmt.Println("place_beet")
		fmt.Printf("actionParams: %s", *actionParams)
	case "matches":
		matchesColl := db.Collection("matches")
		matchesCur, err := matchesColl.Find(ctx, bson.D{{}})
		if err != nil {
			panic(err)
		}

		for matchesCur.Next(ctx) {
			var match Match
			matchesCur.Decode(&match)
			match.PrintDetails()
		}
	case "run":
		Update(db)
	}
}
