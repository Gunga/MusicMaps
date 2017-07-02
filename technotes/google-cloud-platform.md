# Google Cloud Platform

Random notes about using Google Cloud Platform (GCP).

## Setting up Neo4j on a GCP VM

When creating the VM in GCP:
1. Create new VM instance
2. Allow HTTP traffic

On a fresh GCP VM based on the `debian-8` image, the following commands will install Neo4j:

```
# Step 1: Java 8
echo "deb http://httpredir.debian.org/debian jessie-backports main" | sudo tee -a /etc/apt/sources.list.d/jessie-backports.list
sudo apt-get update
sudo apt-get install -t jessie-backports openjdk-8-jdk

# Step 2: HTTPS
sudo apt-get install apt-transport-https

# Step 3: Neo4j
wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.org/repo stable/' | sudo tee /etc/apt/sources.list.d/neo4j.list
sudo apt-get update
sudo apt-get install neo4j=3.2.1
```

Useful links:
- http://neo4j.com/docs/operations-manual/current/installation/linux/debian/
- https://packages.debian.org/jessie-backports/openjdk-8-jdk
- http://neo4j.com/docs/operations-manual/current/configuration/file-locations/
