.PHONY: up down restart clean logs

up:
	docker-compose --env-file .env up --build

down:
	docker-compose down

restart: down up

clean:
	docker-compose down -v
	docker-compose --env-file .env up -d

logs:
	docker-compose logs -f

status:
	docker-compose ps