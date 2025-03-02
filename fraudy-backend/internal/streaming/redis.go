package streaming

import (
	"context"
	"os"
	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()
var RedisClient *redis.Client

func InitRedis() {
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", 
		DB:       0,
	})
}
