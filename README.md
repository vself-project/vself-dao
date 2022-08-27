# vSelf DAO

Root of vSelf community.

## Deployment status

For details of events smart-contract and deployment instructions please refer to [Events](EVENTS.md).

### Staging (Testnet)
- [web application](https://testnet.vself.app)
- [smart-contract](https://explorer.testnet.near.org/accounts/events_v22.sergantche.testnet) deployed to events_v22.sergantche.testnet

### Production (Mainnet)
- [web application](https://vself.app)
- [smart-contract](https://explorer.near.org/accounts/v2.event.vself.near) deployed to v2.event.vself.near

## Synopsys

vSelf project was formed around the idea of a libertarian future where people are happy to coexist not only with other humans but with other sentient beings (including AIs) and, of course, mother nature. We believe that the time has come to start building a reliable interface between person and cyberspace, which will allow us to trust our robotic counterparts. For example, to manage our personal data and facilitate other aspects of our social and economic life.

The only thing we can rely on is the laws of physics. That brings cryptography and multiparty computation protocols to the table as the basis for the construction of self-sovereign systems. According to [cypherpunks manifesto](https://www.activism.net/cypherpunk/manifesto.html), it is enough for humanity’s needs to ensure that it doesn't lose its agency as well as remains in control.

## Design Rationale

Self-soveregnity and level of decentralization of the current generation of dApps are highly questionable, as Moxie Marlinspike has brilliantly demonstrated in [his piece](https://moxie.org/2022/01/07/web3-first-impressions.html). Many Web3 infrastructures are either prone to cancel culture or are politically centralized. The most successful dApp is still Satoshi's network, with others like Ethereum / Polkadot / NEAR building up momentum towards sovereignty and adoption.

Below you can see a birds eye view on the whole vSelf system:

1. (People) Community governance / legal => controls vSelf DAO and source code
1. (Law) vSelf DAO contracts / documents => controls operational expenses, controls cloud setup
1. (DevOps) vSelf Cloud => hosts vSelf services, delivers vSelf App
1. (UI/UX) vSelf App => stores personal data and creates user experience

This is probably the most generic setup for any dApp. In the beginning operational and tech desicionss are full responsibility of vSelf top level management, but this approach allows us to gradually evolve toward more political decentralization. as it allow us to make this DAO future compatible. We also understand that we have to be fully opensource and open to public scrutinity.

The other important part which is our adherence to open standarts and guidlines developed by international community of experts. That's why we look closely at DID and VC data models, which we use and adapt for our specific use cases.

## Blueprints

As we have already discussed what vSelf might look like eventually, in this section we will present our specific tech choices for the first product we are going to deliver. There are several resons and premises we based our architecture and tech choices off, let's see some. As we progress with design at every stage we try to keep it simple and rely only on open source software.

The main risk we want to avoid is dependence on service providers who can disrupt or censor our services for some reason without our consent. So we made particular choices for our codebase and tech stack to mitigate this kind of threat.

1. For the source of truth and governance / economic layer we have chosen NEAR technology as it's the best in class of carbon neutral scalable proof-of-stake blockchain.
1. For the communication layer AND database solution we chose to use GunDB peer-to-peer graph database.
1. For the large objects storage we are going to integrate different solutions (Google Storage, NEAR.Machina, Filecoin, Swarm).
1. Open source tech like Kubernetes + Docker is used for the cloud orchestration.

As we need to host our cloud services somewhere we currently use GCloud which poses kind of deplatforming threat. This can be addressed by incentivisation of cloud infrastructure providers and as well as making our cloud include more hosting providers with time.

Our codebase is stored on GitHub, and consists of the following:
- Cloud configuration, design documentation
- vSelf smart contracts (business logic)
- Dockerized vSelf node which contains business logic:
    1. NEAR Indexer service (in Rust)
    1. GUN database storage instance
- vSelf tooling (CLI) + TS/JS SDK for application developers
- vSelf progressiwe web application / identity wallet / API service (Next.js + tRPC)

![](docs/system.png)

![](docs/legend.png)

## Use cases
[Events](EVENTS.md)

[Governance](HQ.md)
