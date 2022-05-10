package main

import (
	"context"
	"fmt"
    "encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

func hello(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprint(w, "hello\n")
}

type listPlayersResponse struct {
    Players []Player `json:"players"`
}

func HttpServe(db *mongo.Database) {
    listPlayersHandler := func (w http.ResponseWriter, _ *http.Request) {
        ctx := context.TODO()
        playersColl := db.Collection("players")
        opts := options.Find().SetSort(bson.D{{"points", -1}})
        playersCur, err := playersColl.Find(ctx, bson.D{}, opts)
        if err != nil {
            panic(err)
        }

        var players []Player
        playersCur.All(ctx, &players)
        listPlayersRes := &listPlayersResponse{ Players: players }
        jsonStr, _ := json.Marshal(listPlayersRes)

        w.Header().Add("Content-Type", "application/json; charset=utf-8")
        fmt.Fprint(w, string(jsonStr))
    }

	http.HandleFunc("/hello", hello)
    http.HandleFunc("/list-players", listPlayersHandler)
    fmt.Println("listening to :8090")
    if err := http.ListenAndServe(":8090", nil); err != nil {
        panic(err)
    }
}
