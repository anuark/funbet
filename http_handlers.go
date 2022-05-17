package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type listMatchesResponse struct {
	Matches []Match `json:"matches"`
}

func ListMatchesHandler(w http.ResponseWriter, r *http.Request) {
	db := GetDb()
	ctx := context.TODO()
	matchesColl := db.Collection("matches")
	opts := options.Find().SetSort(bson.D{{"match_date", 1}})
	matchesCur, err := matchesColl.Find(ctx, bson.D{}, opts)
	if err != nil {
		panic(err)
	}

	var matches []Match
	matchesCur.All(ctx, &matches)
	listMatchesRes := &listMatchesResponse{Matches: matches}
	jsonStr, _ := json.Marshal(listMatchesRes)

	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	fmt.Fprint(w, string(jsonStr))
}

type listPlayersResponse struct {
	Players []Player `json:"players"`
}

func ListPlayersHandler(w http.ResponseWriter, r *http.Request) {
	db := GetDb()
	ctx := context.TODO()
	playersColl := db.Collection("players")
	opts := options.Find().SetSort(bson.D{{"points", -1}})
	playersCur, err := playersColl.Find(ctx, bson.D{}, opts)
	if err != nil {
		panic(err)
	}

	var players []Player
	playersCur.All(ctx, &players)
	listPlayersRes := &listPlayersResponse{Players: players}
	jsonStr, _ := json.Marshal(listPlayersRes)

	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	fmt.Fprint(w, string(jsonStr))
}

func PlaceBetHandler(w http.ResponseWriter, r *http.Request) {
	db := GetDb()
	ctx := context.TODO()
	playersColl := db.Collection("players")
	opts := options.Find().SetSort(bson.D{{"points", -1}})
	playersCur, err := playersColl.Find(ctx, bson.D{}, opts)
	if err != nil {
		panic(err)
	}

	var players []Player
	playersCur.All(ctx, &players)
	listPlayersRes := &listPlayersResponse{Players: players}
	jsonStr, _ := json.Marshal(listPlayersRes)

	w.Header().Add("Content-Type", "application/json; charset=utf-8")
	fmt.Fprint(w, string(jsonStr))
}
