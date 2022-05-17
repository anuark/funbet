package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"text/tabwriter"
)

type Player struct {
	Id     uint   `bson:"id" json:"id"`
	Name   string `bson:"name" json:"name"`
	Points uint   `bson:"points" json:"points"`
}

func (p Player) GetAll(db *mongo.Database) []Player {
	coll := db.Collection("players")
	// var results []bson.D
	var results []Player
	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		panic(err)
	}
	cursor.All(context.TODO(), &results)
	return results
}

func PrintPlayers(players []Player, w io.Writer) {
	padding := 3
	tabW := tabwriter.NewWriter(w, 0, 0, padding, ' ', tabwriter.FilterHTML)
	fmt.Fprintln(tabW, "Id\tPlayer\tScore\t")
	// fmt.Fprintln(w, "--\t------\t")
	fmt.Fprintln(tabW, "\t\t\t")
	for _, player := range players {
		fmt.Fprintf(w, "%d\t%s\t%d\t\n", player.Id, player.Name, player.Points)
	}
	tabW.Flush()
}
