package main

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
    "context"
	"time"
	// "github.com/icrowley/fake"
	// "math/rand"
)

func Update(db *mongo.Database, frequency time.Duration) {
    ctx := context.Background()
	done := make(chan bool)
	ticker := time.NewTicker(frequency)

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			fmt.Println("update ", t)
			matchesColl := db.Collection("matches")
			playersColl := db.Collection("players")

			cur, _ := matchesColl.Find(ctx, bson.D{{
				"$and", bson.A{
					bson.D{{"decided", false}},
					bson.D{{"match_date", bson.D{{"$lte", time.Now()}}}}},
			}})

			for cur.Next(ctx) {
				var match Match
				if err := cur.Decode(&match); err != nil {
					panic(err)
				}

				fmt.Printf("id: %d match: %s - %s\n", match.Id, match.HomeTeam, match.AwayTeam)
				if _, err := matchesColl.UpdateOne(ctx, bson.D{{"id", match.Id}}, bson.D{{"$set", bson.D{{"decided", true}}}}); err != nil {
					panic(err)
				}

				// home voted players
				for _, playerId := range match.HomePlayerIds {
					if match.HomeScore > match.AwayScore {
						_, err := playersColl.UpdateOne(
							ctx,
							bson.D{{"id", playerId}},
							bson.D{{"$inc", bson.D{{"points", 3}}}},
						)
						if err != nil {
							panic(err)
						}
						fmt.Println("updated ", playerId)
					} else if match.HomeScore == match.AwayScore {
						_, err := playersColl.UpdateOne(
							ctx,
							bson.D{{"id", playerId}},
							bson.D{{"$inc", bson.D{{"points", 1}}}},
						)
						if err != nil {
							panic(err)
						}
						fmt.Println("updated ", playerId)
					}
				}

				// away voted players
				for _, playerId := range match.AwayPlayerIds {
					if match.HomeScore < match.AwayScore {
						_, err := playersColl.UpdateOne(
							ctx,
							bson.D{{"id", playerId}},
							bson.D{{"$inc", bson.D{{"points", 3}}}},
						)
						if err != nil {
							panic(err)
						}
						fmt.Println("updated ", playerId)
					} else if match.HomeScore == match.AwayScore {
						_, err := playersColl.UpdateOne(
							ctx,
							bson.D{{"id", playerId}},
							bson.D{{"$inc", bson.D{{"points", 1}}}},
						)
						if err != nil {
							panic(err)
						}
						fmt.Println("updated ", playerId)
					}
				}
			}
		}
	}
}
