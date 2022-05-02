package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"os"
	"text/tabwriter"
	"time"
)

type Match struct {
	Id            uint
	HomeTeam      string    `bson:"home_team"`
	AwayTeam      string    `bson:"away_team"`
	HomeScore     int       `bson:"home_score"`
	AwayScore     int       `bson:"away_score"`
	Decided       bool      `bson:"decided"`
	MatchDate     time.Time `bson:"match_date"`
	HomePlayerIds []int     `bson:"home_player_ids"`
	AwayPlayerIds []int     `bson:"away_player_ids"`
}

func (m Match) GetAll(db *mongo.Database) []Match {
	coll := db.Collection("players")
	// var results []bson.D
	var results []Match
	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		panic(err)
	}
	cursor.All(context.TODO(), &results)
	return results
}

func PrintAllMatches(matches []Match) {
	padding := 3
	w := tabwriter.NewWriter(os.Stdout, 0, 0, padding, ' ', tabwriter.FilterHTML)
	fmt.Fprintln(w, "Home\tScore\tAway")
    fmt.Fprintln(w, "\t\t")
	for _, match := range matches {
		fmt.Fprintf(w, "%s\t%d - %d\t%s\n", match.HomeTeam, match.HomeScore, match.AwayScore, match.AwayTeam)
	}
	w.Flush()
}

func (m Match) PrintDetails() {
	padding := 3
	w := tabwriter.NewWriter(os.Stdout, 0, 0, padding, ' ', tabwriter.FilterHTML)
    fmt.Fprintf(w, "Match Date: %s\n", m.MatchDate.Format(time.RFC822))
    fmt.Fprintf(w, "Decided: %s\n", If(m.Decided, "Yes", "No"))
	fmt.Fprintln(w, "Home\tScore\tAway")
	fmt.Fprintf(w, "%s\t%d - %d\t%s\n", m.HomeTeam, m.HomeScore, m.AwayScore, m.AwayTeam)
    fmt.Fprintln(w, "\t\t")
	w.Flush()
}