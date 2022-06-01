package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func ListPlayersHandler(w http.ResponseWriter, _ *http.Request) {
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
    matchesColl := db.Collection("matches")
	ctx := context.TODO()
	var post map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		panic(err)
	}

    var match Match
    // objId, _ := primitive.ObjectIDFromHex("626f1f5a760c3722893a80a7")
    objId, _ := primitive.ObjectIDFromHex("626f1f5a760c3722893a80a7")
    _ = objId
    // matchesColl.FindOne(ctx, bson.M{"_id": objId}).Decode(&match)
    matchesColl.FindOne(ctx, bson.M{"_id": objId}).Decode(&match)
    fmt.Println(match)

	switch post["voteFor"] {
	case "home":
        fmt.Println("home")
	case "away":
        fmt.Println("away")
	case "draw":
        // matchesColl.UpdateOne(ctx, bson.D{{"_id", post["matchId"]}}, bson.D{{"$push", bson.D{{"draw_player_ids", post["playerId"]}}}})
        fmt.Println("draw")
	default:
        http.Error(w, "invalid value", http.StatusBadRequest)
	}

	// w.Header().Add("Content-Type", "application/json; charset=utf-8")
	// fmt.Fprint(w, string(jsonStr))
	w.Write([]byte(""))
}
