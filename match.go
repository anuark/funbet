package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"text/tabwriter"
	"time"
)

type Match struct {
	Id            primitive.ObjectID `bson:"_id" json:"_id"`
	HomeTeam      string             `bson:"home_team" json:"home_team"`
	AwayTeam      string             `bson:"away_team" json:"away_team"`
	HomeScore     int                `bson:"home_score" json:"home_score"`
	AwayScore     int                `bson:"away_score" json:"away_score"`
	Decided       bool               `bson:"decided" json:"decided"`
	MatchDate     time.Time          `bson:"match_date" json:"match_date"`
	HomePlayerIds []int              `bson:"home_player_ids" json:"home_player_ids"`
	AwayPlayerIds []int              `bson:"away_player_ids" json:"away_player_ids"`
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

func PrintAllMatches(w io.Writer, matches []Match) {
	padding := 3
	tabW := tabwriter.NewWriter(w, 0, 0, padding, ' ', tabwriter.FilterHTML)
	fmt.Fprintln(tabW, "Home\tScore\tAway")
	fmt.Fprintln(tabW, "\t\t")
	for _, match := range matches {
		fmt.Fprintf(tabW, "%s\t%d - %d\t%s\n", match.HomeTeam, match.HomeScore, match.AwayScore, match.AwayTeam)
	}
	tabW.Flush()
}

func (m Match) PrintDetails(w io.Writer) {
	padding := 3
	tabW := tabwriter.NewWriter(w, 0, 0, padding, ' ', tabwriter.FilterHTML)
	fmt.Fprintf(tabW, "Match Date: %s\n", m.MatchDate.Format(time.RFC822))
	fmt.Fprintf(tabW, "Decided: %s\n", If(m.Decided, "Yes", "No"))
	fmt.Fprintln(tabW, "Home\tScore\tAway")
	fmt.Fprintf(tabW, "%s\t%d - %d\t%s\n", m.HomeTeam, m.HomeScore, m.AwayScore, m.AwayTeam)
	fmt.Fprintln(tabW, "\t\t")
	tabW.Flush()
}
