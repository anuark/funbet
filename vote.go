package main

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
    "strconv"
    "context"
)

func PlaceBet(db *mongo.Database, playerId, matchId, isHomeVote string) error {
    ctx := context.Background()
    matchesColl := db.Collection("matches")
    pId, err := strconv.Atoi(playerId)
    if err != nil {
        return err
    }
    mId, err := strconv.Atoi(matchId)
    if err != nil {
        return err
    }
    vote := isHomeVote == "true"

    if vote {
        _, err := matchesColl.UpdateOne(ctx, bson.D{{"id", mId}}, bson.D{{"$push", bson.D{{"home_player_ids", pId}}}})
        return err
    } else {
        _, err := matchesColl.UpdateOne(ctx, bson.D{{"id", mId}}, bson.D{{"$push", bson.D{{"away_player_ids", pId}}}})
        return err
    }
}
