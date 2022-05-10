package models

import (
    "time"
)

type Tournament struct {
    Id uint
    Name string
    FinishDate time.Time
}
