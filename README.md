# vSelf DAO

## Synopsys

vSelf project was formed around the idea of a libertarian future where people are happy to coexist not only with other humans, but with other sentient beings (including AIs), and of course mother nature. We believe that the time has come to start building reliable interface between person and cyberspace, which will allow us to trust our robotic counterparts. For example to manage our personal data and facilitate other aspects of our social / economic life.

The only thing we can rely on is laws of physics. That brings cryptography and multiparty computation protocols to the table as the basis for the construction of self-sovereign systems. According to [cypherpunks manifesto]() this is enough what humanity needs to ensure it doesn't lose it's agency as well as remains in control. build

## Design Rationale

Self-soveregnity of current generation of dApps is highly questionable, as Morly Marlinspike has brilliantly demonstrated in his piece. A lot of infrastructure that is being built is either prone to cancel culture or politically centralized. The most successful dApp is still Satoshi's network, with others like Ethereum / Polkadot / NEAR building up momentum towards soverenigty and adoption.

Below you can see a birds eye view on the whole vSelf system:

1. (People) Community governance / legal => controls vSelf DAO and source code
1. (Law) vSelf DAO contracts / documents => controls operational expenses, controls cloud setup
1. (DevOps) vSelf Cloud => hosts vSelf services, delivers vSelf App
1. (UI/UX) vSelf App => stores personal data and creates user experience

This is probably the most generic setup for any dApp. In the begining operational and tech desicionss are full responsibility of vSelf top level management, but this approach allows us to gradually evolve toward more political decentralization. as it allow us to make this DAO future compatible. We also understand that we have to be fully opensource and open to public scrutinity.

The other important part which is our adherence to open standarts and guidlines developed by international community of experts. That's why we look closely at DID and VC data models, which we use and adapt for our specific use cases.

[PIC]

## Blueprints

As we have already discussed what vSelf might look like eventually, in this section we will present our specific tech choices for the first product we are going to deliver. There are several resons and premises we based our architecture and tech choices off, let's see some. As we progress with design at every stage we try to keep it simple and rely only on open source software.

The main risk we want to avoid is dependence on service providers who can disrupt or censor our services for some reason without our consent. So we made particular choices for our codebase and tech stack to mitigate this kind of threat.

1. For the source of truth and governance / economic layer we have chosen NEAR technology as it's the best in class of carbon neutral scalable proof-of-stake blockchain.
1. For the communication layer AND database solution we chose to use GunDB peer-to-peer
1. For the large objects storage we are going to integrate different solutions (Google Storage, NEAR.Machina, Filecoin, Swarm).
1. Open source tech like Kubernetes + Docker is used for the cloud orchestration.

As we need to host our cloud services somewhere we currently use GCloud which poses kind of deplatforming threat. This can be addressed by incentivisation of cloud infrastructure providers and as well as making our cloud include more hosting providers with time.

[PIC]