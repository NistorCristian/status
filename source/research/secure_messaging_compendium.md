---
id: secure_messaging_compendium
title: Secure Messaging Compendium
---

# Secure messaging compendium

## Starting point

Read [this message](https://medium.com/message/everything-is-broken-81e5f33a24e1).

## Whisper

### Talks and specs

In general, some of the links are dated 2015 whereas the protocol has moved to version 6 by now..

* [EIP-627](http://eips.ethereum.org/EIPS/eip-627) - Vlad Gluhovsky's proposal to document the protocol. There's some interesting discussion in the [PR thread](https://github.com/ethereum/EIPs/pull/627#discussion_r124582523) about supporting multiple topics per message - now a parity extension (`psh`)
* [Whisper PoC Protocol spec](https://github.com/ethereum/wiki/wiki/Whisper-PoC-2-Protocol-Spec) - this looks like one of the most detailed accounts of the thinking that went into whisper
* [Whisper Proposal - Ethereum Wiki](https://github.com/ethereum/wiki/wiki/Whisper) - some high-level overview and background discussion
* [Whisper Overview - Ethereum Wiki](https://github.com/ethereum/wiki/wiki/Whisper-Overview) - Useful section on use cases describing the effect of supplying different combinations of keys and encryption
* [DEVCON1: Shh! Whisper - Gavin Wood](https://www.youtube.com/watch?v=U_nPoBVLPiw)
* [DEVCON3: Whisper: Achieving Darkness - Vlad Gluhovsky, Guillaume Ballet](https://youtu.be/vXVcuWvR5Z0?t=10)
* [Scuttlebutt talks](https://www.scuttlebutt.nz/talks)

### Status notes and usages
* [Call notes, Vlad/Status](https://docs.google.com/document/d/1RfGIYpZ8xOJKBD0w1F-DtwCKTA43O4zyWhxFtLtdLNc/edit) 
* [Status whisper research](https://wiki.status.im/Research_Whisper_Status) - V5-V6 difference, status implementation notes and what status needs the procotocol for
* [Open issues brainstorming](https://docs.google.com/document/d/1Cw3LA1r6ItLDp8bMFvIxQMxYjnzEVOcHuZJz8gRa7HE/edit#) - round-table on what whisper pain points are held with our Whisper devs (2018-04-18)
* [Messsage spec, clojure](https://github.com/status-im/status-react/blob/develop/src/status_im/transport/message/transit.cljs)
* [Protocol background work doc](https://docs.google.com/document/d/1Qh2h07T_qepzEJ7IytmxwIdQAOsGHrvhXwZxuZtbwgc/edit)
* [Status wiki whisper docs, including V5/V6 comparison](https://wiki.status.im/index.php?title=Research_Whisper_Status)
* [How-status-uses-whisper thread](https://status-im.slack.com/archives/C8QP8S5UH/p1523495849000201)
* [Mail-server topic-vs-bloom discussion](https://status-im.slack.com/archives/C8QP8S5UH/p1523256511000120)
* [JS usage example](https://gist.github.com/noman-land/410fbfd632b61d29e78120b2475e9955) - how to post a message to the chat

### Push notification
* [Push notifications v2](https://github.com/status-im/ideas/blob/master/ideas/086-push-notif-v2/README.md) - idea for the next iteration of PN
* [Whisper push notifications](https://github.com/status-im/status-go/wiki/Whisper-Push-Notifications) - this looks like the most recent one (?)
* [Push notification market](https://wiki.status.im/Decentralized_Push_Notification_Market)
* [Where we are at](https://wiki.status.im/Push_notifications_-_Where_we_are_at)
* [Original proposal](https://docs.google.com/document/d/1OgjnY8ps8lVA4dIohwkfGK9HVt0nZxEWbuNdb7BX5-o/edit#heading=h.kjam5hcc2nif)

## PSS - postal service over swarm
* [Swarm PSS](https://github.com/ethersphere/go-ethereum/blob/a12c003114ab702a820428c2c6ef3d950e1e0a55/swarm/pss/ARCHITECTURE.md) - architectural notes, crucial quote: `Optionally routing can be turned off, forcing the message to be sent to all peers, similar to the behavior of the whisper protocol.`
[PSS = bzz whispered](https://gist.github.com/zelig/d52dab6a4509125f842bbd0dce1e9440) - initial PSS idea description
[PSS hacking](https://hackmd.io/dDvTNlSWS6601GQ9LbEY8Q#) - Group chat using mutable resources from Mainframe / PSS

## Related ETH projects
* [Mainframe](https://mainframe.com/) - Swarm/PSS user?
* [Bloom](https://blog.hellobloom.io/introducing-bloom-payment-channels-enabled-by-ethereum-whisper-1fec8ba10a03) - whisper use-cases
* [Origin](https://medium.com/originprotocol/introducing-origin-messaging-decentralized-secure-and-auditable-13c16fe0f13e) - distributed log-based messenger, as well as an IPFS-based replicated log database

## Secure messaging - Non-ethereum
* [Building a secure messenger - EFF](https://www.eff.org/deeplinks/2018/03/building-secure-messenger)
* [Tox](https://wiki.tox.chat/users/techfaq) - distributed secure chat, DHT-based P2P lookup with lots of clients
* [Briar](https://briarproject.org/how-it-works.html) - messaging app employing several censorship-resitance techniques, like direct device-to-device comms (bluetooth, wifi), tor routing,
* [FireChat](https://www.opengarden.com/firechat.html) - mesh comms, closed source
* [Wire](https://wire.com/en/security/) - Open source messenger with lots of transparency around security
* [Vuvuzela](https://vuvuzela.io/) - metadata-leak-resistant chat protocol / application, also alpenhorn that takes care of contact setup / key exchange
* [cwtch](https://cwtch.im/) - extension of the Ricochet protocol that provides asynchronous, offline and multi-party metadata resistant messaging
* [Scuttlebutt](https://www.scuttlebutt.nz) - open source, p2p replicated ledgers. 3 year old ecosystem, in active use. Offline friendly. Recent Android app (runs peer instance) https://manyver.se

## Security / encryption
* [X3DH](https://signal.org/docs/specifications/x3dh/) - key exchange protocol for async comms with an intermediary server involved
* [On Ends-to-Ends Encryption: Asynchronous Group Messaging with Strong Security Guarantees](https://eprint.iacr.org/2017/666.pdf) - Continuation of Signal Double Ratchet
* [Megolm](https://git.matrix.org/git/olm/about/docs/megolm.rst) - An AES-based cryptographic ratchet intended for group communications

## Alternate protocol
* [Salsify](https://snr.stanford.edu/salsify/) - real-time Internet video that jointly controls a video codec and a network transport protocol

## PSS Open issues
* Mutable resources, how to find last message? binary search?
* Swap incentives?