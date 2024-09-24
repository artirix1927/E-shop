FROM python:3.12-slim

# Set the working directory for the chat app
WORKDIR /backend/chat

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    librdkafka-dev \
    && apt-get clean




COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .


EXPOSE 8008

# Run the chat service
#CMD ["python", "manage.py runserver localhost:8008",]