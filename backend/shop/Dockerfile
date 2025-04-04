FROM python:3.12-slim

# Set the working directory for the shop app
WORKDIR /backend/shop

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    librdkafka-dev \
    git \
    && apt-get clean

# Copy the requirements file and install dependencies

COPY requirements.txt .
RUN pip install git+https://github.com/artirix1927/Common-Streaming-Package.git#egg=common_streaming

RUN pip install --no-cache-dir -r requirements.txt

# Copy the shop source code
COPY . .

# Expose the port for the shop app
EXPOSE 8000

# Run the shop service
#CMD ["python", "manage.py runserver localhost:8000"]