package main

import (
	"flag"
	// "fmt"
	// "github.com/icrowley/fake"
	// "math/rand"
	"time"
    "github.com/joho/godotenv"
)

type Player struct {
	Id   uint
	Name string `bson:"name"`
}

type Match struct {
	HomeTeam  string    `bson:"home_team"`
	AwayTeam  string    `bson:"away_team"`
	HomeScore int       `bson:"home_score"`
	AwayScore int       `bson:"away_score"`
	Decided   bool      `bson:"decided"`
	MatchDate time.Time `bson:"match_date"`
}

type PlayerMatch struct {
	Id       uint
	PlayerId uint `bson:"player_id"`
	MatchId  uint `bson:"match_id"`
}

func main() {
    // env
    godotenv.Load(".env")

    // db
	client := NewMongoConnection()
    defer DisconnectDb(client)

    // cmd flags
	generateFlag := flag.Bool("g", false, "generate data")
    flag.Parse()

	if *generateFlag {
		GenerateData(client)
	}

	// ticker := time.NewTicker(time.Second * 1)
	// go func() {
	//     for {
	//         select {
	//         case <-ticker.C:
	//         }
	//     }
	// }()
}
