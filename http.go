package main

import (
	"fmt"
	"github.com/justinas/alice" // middleware handler
	"github.com/rs/cors"
	"net/http"
	"time"
)

func hello(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprint(w, "hello\n")
}

func timeoutHandler(h http.Handler) http.Handler {
	return http.TimeoutHandler(h, 30*time.Second, "timed out")
}

func HttpServe() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", hello)
	mux.HandleFunc("/list-players", ListPlayersHandler)
	mux.HandleFunc("/list-matches", ListMatchesHandler)
	mux.HandleFunc("/place-bet", PlaceBetHandler)
	// cors := cors.New(cors.Options{
	// 	AllowedOrigins: []string{"*"},
	// 	Debug:          true,
	// })
	cors := cors.Default()
	chain := alice.New(cors.Handler, timeoutHandler).Then(mux)
	fmt.Println("listening to :8090")
	if err := http.ListenAndServe(":8090", chain); err != nil {
		panic(err)
	}
}
