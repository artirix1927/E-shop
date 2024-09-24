FROM python:3.12-slim

# Set the working directory for the chat app
WORKDIR /backend/microemail

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    librdkafka-dev \
    && apt-get clean
    


COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

    


# CMD ["py", "manage.py run_kafka_consumer"]