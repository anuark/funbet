package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"time"
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
	action := os.Args[1]
	flag.Parse()

	if *generate {
		GenerateData(db)
	}

	switch action {
	case "list_players":
		playersColl := db.Collection("players")
		opts := options.Find().SetSort(bson.D{{"points", -1}})
		playersCur, err := playersColl.Find(ctx, bson.D{}, opts)
		if err != nil {
			panic(err)
		}

		var players []Player
		playersCur.All(ctx, &players)
		PrintPlayers(players, os.Stdout)
	case "place_bet":
        // example: ./funbet {playerId} {matchId} true
		fmt.Println("place_bet")
		playerId := os.Args[2]
		matchId := os.Args[3]
		isHomeVote := os.Args[4]
		err := PlaceBet(db, playerId, matchId, isHomeVote)
		if err != nil {
			panic(err)
		}
	case "matches":
		matchesColl := db.Collection("matches")
		matchesCur, err := matchesColl.Find(ctx, bson.D{{}})
		if err != nil {
			panic(err)
		}

		for matchesCur.Next(ctx) {
			var match Match
			matchesCur.Decode(&match)
			match.PrintDetails(os.Stdout)
		}
	case "run":
		Update(db, time.Second*1)
    case "serve":
        HttpServe(db)
	}
}
