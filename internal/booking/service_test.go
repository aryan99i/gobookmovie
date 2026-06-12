package booking

import (
	"fmt"
	"sync"
	"sync/atomic"
	"testing"

	adapters_redis "goprojv2/internal/adapters/redis"

	"github.com/google/uuid"
)

func TestConcurrentBooking_ExactlyOneWins(t *testing.T) {
	store := NewRedisStore(adapters_redis.NewClient("localhost:6379"))
	svc := NewService(store)

	const numGoroutines = 100_000 // 100k users trying to book a seat at the same time

	var (
		successes atomic.Int64
		failures  atomic.Int64
		wg        sync.WaitGroup
	)

	wg.Add(numGoroutines)
	for i := range numGoroutines {
		go func(userNum int) {
			defer wg.Done()
			_, err := svc.Book(Booking{
				MovieId: "screen-1",
				SeatId:  "A1",
				UserId:  uuid.New().String(),
			})
			if err == nil {
				successes.Add(1)
			} else {
				failures.Add(1)
			}
		}(i)
	}
	wg.Wait()

	fmt.Printf("Success : %d, fails: %d ", successes, failures)

	if got := successes.Load(); got != 1 {
		t.Errorf("expected exactly 1 success, got %d", got)
	}
	if got := failures.Load(); got != int64(numGoroutines-1) {
		t.Errorf("expected %d failures, got %d", numGoroutines-1, got)
	}
}
