# Google Cloud Platform

Random notes about using Google Cloud Platform (GCP).

## Setting up Neo4j

Using the `debian-9` image and the [Neo4j Debian instructions](http://debian.neo4j.org/), the following commands will install Neo4j on a GCP VM:

```
sudo apt-get install apt-transport-https
wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.org/repo stable/' | sudo tee /etc/apt/sources.list.d/neo4j.list
sudo apt-get update
```
