---
title: RabbitMQ on Kubernetes! Hands-On Adventure! 
date: 2025-04-24 01:01:01 +/-TTTT
categories: [rabbitmq, messaging, k8s , kubernetes]
tags: [rabbitmq, messaging, k8s, kubernetes]     # TAG names should always be lowercase
---

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q2P5CM1K51"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Q2P5CM1K51');
</script>

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>


<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>


# 🚀 RabbitMQ on Kubernetes: Your Fun, Hands-On Adventure! 🐰📦

Hey there, fellow tech explorers! 👋 Ready to dive into the world of messaging queues and Kubernetes? Buckle up, because this workshop is your ticket to getting your hands delightfully dirty with OSS RabbitMQ running like a charm on K8s!

## 🗺️ Your Treasure Map: Cloning the Repo

First things first, let's snag the treasure chest of code we'll be using. Open up your terminal and type these magical incantations:

```
git clone https://github.com/cfkubo/rmq-workshop
cd rmq-workshop/k8s
```
Boom! You've got the code. Now, let's navigate to the k8s folder where all the Kubernetes goodies are hiding.

## 🛠️ Laying the Foundation: Installing the RabbitMQ Operator
Think of the RabbitMQ Operator as your friendly K8s assistant, making sure your RabbitMQ clusters are healthy and happy. Let's get this helpful buddy installed on your Kubernetes cluster (any K8s will do!):


```
kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml

```

This command tells Kubernetes to apply the configuration for the RabbitMQ Cluster Operator. It's like telling your K8s, "Hey, keep an eye out for RabbitMQ needs!"

To make sure our assistant arrived safely, let's peek at the namespaces:


```
kubectl get namespaces
```

You should see something like this in the output, and the important line here is rabbitmq-system – that's where our operator is chilling:

```
NAME              STATUS   AGE
default           Active   73s
kube-node-lease   Active   73s
kube-public       Active   73s
kube-system       Active   73s
rabbitmq-system   Active   2s
```


## 🚀Meet Your New Best Friend: RabbitmqAdmin CLI
Want a command-line tool to interact with RabbitMQ? Say hello to rabbitmqadmin!

Head over to this link to grab the binary for your operating system:

[https://github.com/rabbitmq/rabbitmqadmin-ng/releases](https://github.com/rabbitmq/rabbitmqadmin-ng/releases)

Once downloaded, let's make it executable and put it where you can easily use it:
```
# Assuming you downloaded a file like rabbitmqadmin-2.1.0-your-os
cp rabbitmqadmin-2.1.0-* rmqadmin
chmod +x rmqadmin
sudo mv rmqadmin /usr/local/bin
rmqadmin --help
```


## 🐇 Single and Ready to Mingle: Deploying a Single-Node RabbitMQ Cluster
Sometimes, you just need a solo RabbitMQ instance to get started. Let's deploy a simple, single-node cluster:

```
kubectl apply -f https://raw.githubusercontent.com/rabbitmq/cluster-operator/main/docs/examples/hello-world/rabbitmq.yaml
```

Kubernetes is now off to create our RabbitMQ pod. Let's see if it's up and hopping:

```
kubectl get po
```

You should see a pod named something like hello-world-server-0 in the Running state:

```
NAME                   READY   STATUS    RESTARTS   AGE
hello-world-server-0   1/1     Running   0          3m19s
```

To get a more RabbitMQ-centric view, let's ask the operator about our cluster:

```
k get rabbitmqclusters.rabbitmq.com hello-world
```

If all went well, you'll see True for both ALLREPLICASREADY and RECONCILESUCCESS:
```
NAME          ALLREPLICASREADY   RECONCILESUCCESS   AGE
hello-world   True               True               5m26s
```

Hooray! Your single RabbitMQ node is ready!

## 👯‍♀️ The More the Merrier: Deploying a Multi-Node RabbitMQ Cluster
Now, let's crank things up a notch and deploy a cluster with multiple RabbitMQ nodes for better resilience and scalability. We'll use a configuration in the rmq.yaml file (make sure this file exists in your k8s directory):

```
kubectl apply -f rmq.yaml
```

Let's check the pods again to see our RabbitMQ gang:
```
kubectl  get pods
```
You should now see multiple pods starting with my-tanzu-rabbit-server-:
```
NAME                       READY   STATUS    RESTARTS   AGE
hello-world-server-0       1/1     Running   0          10m
my-tanzu-rabbit-server-0   1/1     Running   0          2m59s
my-tanzu-rabbit-server-1   1/1     Running   0          2m59s
my-tanzu-rabbit-server-2   1/1     Running   0          2m59s
```

Awesome! You've got a multi-node RabbitMQ cluster running on Kubernetes!

## 🔌 Superpowers Activated: Enabling RabbitMQ Plugins
RabbitMQ has tons of cool features packed into plugins. Let's enable some useful ones on one of our RabbitMQ servers (we'll target the first one, my-tanzu-rabbit-server-0):

```
kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmq-plugins enable rabbitmq_stream
kubectl -n default exec my-tanzu-rabbit-server-0 --rabbitmq-plugins enable rabbitmq_stream_management

kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmq-plugins enable rabbitmq_prometheus

kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmq-plugins enable rabbitmq_shovel
kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmq-plugins enable rabbitmq_shovel_management
```

These commands enable plugins for streams, stream management, Prometheus metrics, and the Shovel functionality. Think of it as giving your RabbitMQ server some extra tools in its belt!

## 👤🔑 Setting Up Shop: Users and Permissions
To interact with our RabbitMQ cluster, we'll need a user with the right permissions. Let's create a user named arul with a password password (you should use something more secure in a real setup!) and give it administrator privileges:

```
kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmqctl add_user arul password
kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmqctl set_permissions  -p / arul ".*" ".*" ".*"
kubectl -n default exec my-tanzu-rabbit-server-0 -- rabbitmqctl set_user_tags arul administrator
```

This is like creating a key (arul/password) and giving it full access (".*" ".*" ".*") to the RabbitMQ kingdom (-p /).

## 🕵️‍♂️ Secret Agent: Fetching Default Credentials
The RabbitMQ Operator also creates a default user and password stored as a Kubernetes Secret. Let's grab those:

```
instance=my-tanzu-rabbit
username=$(kubectl -n default   get secret ${instance}-default-user -o jsonpath="{.data.username}" | base64 --decode)
password=$(kubectl -n default   get secret ${instance}-default-user -o jsonpath="{.data.password}" | base64 --decode)
service=${instance}
echo $username
echo $password
```

This little script sniffs out the username and password from the Kubernetes Secret and prints them to your console. Handy for quick access!

## 🖥️ Peeking Inside: Accessing the RabbitMQ Management UI
Want a visual look at your RabbitMQ cluster? Let's use port-forward to access the management UI in your browser:

```
k port-forward svc/my-tanzu-rabbit 15672:15672
```

Now, point your browser to:

[http://localhost:15672](http://localhost:15672)

You can log in using either the default credentials you just fetched or the arul/password user you created. Explore the UI – it's like the cockpit of your RabbitMQ spaceship!

## 🚀 Putting it to the Test: Deploying Producers and Consumers with PerfTest
Time to see our RabbitMQ cluster in action! We'll use the rabbitmq-perf-test tool running as Kubernetes Jobs to simulate message producers and consumers.

### 🧪 PerfTest on K8s: Quorum Queues
Let's run some performance tests with standard and quorum queues (a more robust queue type):

```
kubectl -n default  --restart=Never run sa-workshop --image=pivotalrabbitmq/perf-test -- --uri "amqp://${username}:${password}@${service}" --producers 10 --consumers 5 --predeclared --routing-key "sa-workshop" --pmessages 1000 --queue "sa-workshop" --rate 100 --consumer-rate 10 --multi-ack-every 10

kubectl -n default  --restart=Never run sa-workshop-quorum --image=pivotalrabbitmq/perf-test -- --uri "amqp://${username}:${password}@${service}" --quorum-queue --producers 10 --consumers 5 --predeclared --routing-key "sa-workshop-quorum" --pmessages 1000 --queue "sa-workshop-quorum" --rate 100 --consumer-rate 10 --multi-ack-every 10

kubectl -n default  --restart=Always run arul-perf2 --image=pivotalrabbitmq/perf-test -- --uri "amqp://${username}:${password}@${service}" -i 120 -u "q.sys.synthetic-health-check" -qq -P 5 -ms -b 20 -hst 4 -dcr -c 1 -q 5

```

These commands launch Kubernetes Jobs that will send and receive messages to queues named sa-workshop and sa-workshop-quorum. Keep an eye on your RabbitMQ Management UI to see the queues and message flow!

### 🌊 PerfTest on K8s: Streams
And let's try out the RabbitMQ Streams functionality we enabled earlier:

```
kubectl -n default  --restart=Always run stream --image=pivotalrabbitmq/perf-test -- --uri "amqp://${username}:${password}@${service}" --stream-queue --producers 10 --consumers 5 --predeclared --routing-key "sa-workshop-stream" --pmessages 100 --queue "sa-workshop-stream" --rate 100 --consumer-rate 10 --multi-ack-every 1 -c 10
```

This command will run a continuous performance test using a RabbitMQ Stream queue. Streams offer different messaging semantics compared to traditional queues.

## 🎉 Congratulations, Messaging Maestro! 🎉
You've now taken a fantastic journey through deploying and interacting with RabbitMQ on Kubernetes! You've installed the operator, deployed single and multi-node clusters, enabled plugins, managed users, and even run performance tests.

Keep exploring, experimenting, and having fun with RabbitMQ and Kubernetes! The world of distributed messaging awaits your command! 🚀🐰📦
