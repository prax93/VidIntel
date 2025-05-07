FROM debian:latest

RUN apt update && apt install -y nginx curl ffmpeg && \
	curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
	apt install -y nodejs

WORKDIR /app
COPY ./src/backend/* /app



RUN npm install --loglevel verbose

COPY ./src/frontend/index.html /var/www/html/

VOLUME [ "/movies" ]

ENV CRON_ENABLED="true"
ENV FFPROBE_PATH=/usr/bin/ffprobe

#ENV CRON_SCHEDULE="* * * * * *"

EXPOSE 3000
EXPOSE 80
CMD ["sh", "-c", "nginx -g 'daemon off;' & node index.js"]