---
id: whisper_pss
title: Status Perfect Forward Secrecy Whitepaper
---

Status Perfect Forward Secrecy Whitepaper
====

[TOC]

## 1. Introduction

This whitepaper describes the protocols used by Status to achieve Perfect Forward Secrecy for 1:1 chat participants. It builds on the [X3DH](https://signal.org/docs/specifications/x3dh/) and [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) specifications from Open Whisper Systems, with some adaptations to operate in a decentralized environment.

### 1.1. Definitions

- **Perfect Forward Secrecy** is a feature of specific key-agreement protocols which provide assurances that your session keys will not be compromised even if the private keys of the participants are compromised. Specifically, past messages cannot be decrypted by a third-party who manages to get a hold of a private key.

- **Secret channel** describes a communication channel where Double Ratchet algorithm is in use.

### 1.2. Design Requirements

- **Confidentiality**

  The adversary should not be able to learn what data is being exchanged between two Status clients.

- **Authenticity**

  The adversary should not be able to cause either endpoint of a Status 1:1 chat to accept data from any third party as though it came from the other endpoint.

- **Forward Secrecy**

  The adversary should not be able to learn what data was exchanged between two Status clients if, at some later time, the adversary compromises one or both of the endpoint devices.

### 1.3. Conventions

Types used in this specification are defined using [Protobuf](https://developers.google.com/protocol-buffers/). Protocol buffers are a language-neutral, platform-neutral, extensible mechanism for serializing structured data.

### 1.4. Transport Layer

[Whisper](./index.html) serves as the transport layer for the Status chat protocol. Whisper is a hybrid P2P/DHT communication protocol which delivers messages probabilistically. It is designed to provide configurable levels of darkness and plausible deniability at the expense of high-latency and relatively high bandwidth.

### 1.5. User flow for 1-to-1 communications

#### 1.5.1. Account generation

Generating a user account in Status involves 3 steps:

- Generation of a random seed, and the respective account;
- Generation of a X3DH bundle. This prekey bundle will become part of the user's contact code;
- Registration with Push Notification platform.

#### 1.5.2. Contact request

Once two accounts have been generated (Alice and Bob), Alice can send a contact request with an introductory message to Bob.

There are two possible scenarios, which dictate the presence or absence of a prekey bundle:
1. If Alice is using Bob's public chat key or ENS name, no prekey bundle is present;
1. If Alice found Bob through the app or scanned Bob's QR code, a prekey bundle is embedded and can be used to set up a secure channel as described in section [2.4.1](#241-Initial-key-exchange-flow-X3DH).

Bob receives a contact request, informing him of:
- the security level of the communication;
- Alice's introductory message.

If Bob's prekey bundle was not available to Alice, Perfect Forward Secrecy hasn't yet been established. In any case, there are no implicit guarantees that Alice is whom she claims to be, and Bob should perform some form of external verification (e.g., using an Identicon).

If Bob accepts the contact request, a secure channel is created (if it wasn't already), and a visual indicator is displayed to signify that PFS has been established. Bob and Alice can then start exchanging messages, making use of the Double Ratchet algorithm as explained in more detail in section [2.4.2](#242-Double-Ratchet).
If Bob denies the request, Alice is not able to send messages and the only action available is resending the contact request.

#### 1.5.3. Account recovery

If Alice later recovers her account, the Double Ratchet state information will not be available, so she is no longer able to decrypt any messages received from existing contacts.

If an incoming message (on the same Whisper topic) fails to decrypt, a message is shown to Alice asking whether she wants to re-establish a secure channel with Bob, repeating the procedure in the previous section. **_TODO: @cammellos for more detail, if any_**

## 2. Messaging

All messaging in Status is subject to end-to-end encryption to provide users with a strong degree of privacy and security.

### 2.1. End-to-end encryption

End-to-end encryption (E2EE) takes place between two clients. The main cryptographic protocol is a [Status implementation](https://github.com/status-im/doubleratchet/) of the Double Ratchet protocol, which is in turn derived from the [Off-the-Record protocol](https://otr.cypherpunks.ca/Protocol-v3-4.1.1.html), using a different ratchet. The message payload is subsequently encrypted by the transport protocol - Whisper (see section [1.4](#14-Transport-Layer)) -, using symmetric key encryption. 
Furthermore, Status uses the concept of prekeys (through the use of [X3DH](https://signal.org/docs/specifications/x3dh/)) to allow the protocol to operate in an asynchronous environment. It is not necessary for two parties to be online at the same time to initiate an encrypted conversation.

Status uses the following cryptographic primitives:
- Whisper
    - AES-256-GCM
    - KECCAK-256
- X3DH
    - Elliptic curve Diffie-Hellman key exchange (secp256k1)
    - KECCAK-256
    - ECDSA
    - ECIES
- Double Ratchet
    - HMAC-SHA-256 as MAC
    - Elliptic curve Diffie-Hellman key exchange (Curve25519)
    - AES-256-CTR with HMAC-SHA-256 and IV derived alongside an encryption key

    Key derivation is done using HKDF.

### 2.2. Prekeys

Every client initially generates some key material which is stored locally:
- Identity keypair based on secp256k1 - $IK$;
- A signed prekey based on secp256k1 - $SPK$;
- A prekey signature - <i>Sig($IK$, Encode($SPK$))</i>

Prekey bundles are exchanged through QR codes, contact codes, 1:1 or public chat messages. *We will be updating this document with information about bundle exchange through [ENS](https://ens.domains/) and [Swarm](https://swarm-guide.readthedocs.io/en/latest/introduction.html) as work progresses and technologies become more usable.*

### 2.3. Bundle retrieval

X3DH works by having client apps create and make available a bundle of prekeys (the X3DH bundle) that can later be requested by other interlocutors when they wish to start a conversation with a given user.

In the X3DH specification, a shared server is typically used to store bundles and allow other users to download them upon request. Given Status' goal of decentralization, Status chat clients cannot rely on the same type of infrastructure and must achieve the same result using other means. By growing order of convenience and security, the considered approaches are:
- contact codes;
- public and one-to-one chats;
- QR codes;
- ENS record;
- Decentralized permanent storage (e.g. Swarm, IPFS).

Since bundles stored in QR codes or ENS records cannot be updated to delete already used keys, the approach taken is to make publicly available an initial generic bundle without one-time prekeys, and subsequently provide a second user-specific X3DH prekey bundle (TO BE IMPLEMENTED).

### 2.4. 1:1 chat contact request

There are two phases in the initial negotiation of a 1:1 chat:
1. **Identity verification** (e.g., face-to-face contact exchange through QR code, Identicon matching). A QR code serves two purposes simultaneously - identity verification and initial bundle retrieval;
1. **Asynchronous initial key exchange**, using X3DH.

#### 2.4.1. Initial key exchange flow (X3DH)

The initial key exchange flow is described in [section 3 of the X3DH protocol](https://signal.org/docs/specifications/x3dh/#sending-the-initial-message), with some additional context:
- The users' identity keys $IK_A$ and $IK_B$ correspond to their respective Status chat public keys;
- Since it is not possible to guarantee that a prekey will be used only once in a decentralized world, the one-time prekey $OPK_B$ is not used in this scenario;
- Bundles are not sent to a centralized server, but instead served in a decentralized way as described in [section 2.3](#23-Bundle-retrieval).

Bob's prekey bundle is retrieved by Alice, however it is not specific to Alice. It contains:

([protobuf](https://github.com/status-im/status-go/blob/c86f8bf6ca35280e7041674f76a2ef1fe333e482/services/shhext/chat/encryption.proto#L11))

``` protobuf
message Bundle {
  bytes identity = 1;

  map<string,SignedPreKey> signed_pre_keys = 2;

  bytes signature = 4;
}
```
- `identity`: Identity key $IK_B$
- `signed_pre_keys`: Signed prekey $SPK_B$ for each device, indexed by `installation-id`
- `signature`: Prekey signature <i>Sig($IK_B$, Encode($SPK_B$))</i>

([protobuf](https://github.com/status-im/status-go/blob/c86f8bf6ca35280e7041674f76a2ef1fe333e482/services/shhext/chat/encryption.proto#L5))

``` protobuf
message SignedPreKey {
  bytes signed_pre_key = 1;
  uint32 version = 2;
}
```

The `signature` is generated by sorting `installation-id` in lexicographical order, and concatenating the `signed-pre-key` and `version`:

`installation-id-1signed-pre-key1version1installation-id2signed-pre-key2-version-2`

#### 2.4.2. Double Ratchet

Having established the initial shared secret `SK` through X3DH, we can use it to seed a Double Ratchet exchange between Alice and Bob.

Please refer to the [Double Ratchet spec](https://signal.org/docs/specifications/doubleratchet/) for more details.

The initial message sent by Alice to Bob is sent as a top-level `ProtocolMessage` ([protobuf](https://github.com/status-im/status-go/blob/1ac9dd974415c3f6dee95145b6644aeadf02f02c/services/shhext/chat/encryption.proto#L64)) containing a map of `DirectMessageProtocol` indexed by `installation-id` ([protobuf](https://github.com/status-im/status-go/blob/1ac9dd974415c3f6dee95145b6644aeadf02f02c/services/shhext/chat/encryption.proto#L56)):

``` protobuf
message ProtocolMessage {
  Bundle bundle = 1;

  map<string,DirectMessageProtocol> direct_message = 101;

  bytes public_message = 102;
}
```

- `bundle`: optional bundle is exchanged with each message;
- `direct_message` is a map of `DirectMessageProtocol` indexed by `installation-id`
- `public_message`: unencrypted public chat message.

``` protobuf
message DirectMessageProtocol {
  X3DHHeader X3DH_header = 1;
  DRHeader DR_header = 2;
  DHHeader DH_header = 101;
  // Encrypted payload
  bytes payload = 3;
}
```
- `X3DH_header`: the `X3DHHeader` field in `DirectMessageProtocol` contains:

    ([protobuf](https://github.com/status-im/status-go/blob/features%2Fx3dh/services/shhext/chat/encryption.proto#L27))
    ``` protobuf
    message X3DHHeader {
      bytes key = 1;
      bytes id = 4;
    }
    ```

    - `key`: Alice's ephemeral key $EK_A$;
    - `id`: Identifier stating which of Bob's prekeys Alice used, in this case Bob's bundle signed prekey.

    Alice's identity key $IK_A$ is sent at the transport layer level (Whisper);

- `DR_header`: Double ratchet header ([protobuf](https://github.com/status-im/status-go/blob/features%2Fx3dh/services/shhext/chat/encryption.proto#L16)). Used when Bob's public bundle is available:
    ``` protobuf
    message DRHeader {
      bytes key = 1;
      uint32 n = 2;
      uint32 pn = 3;
      bytes id = 4;
    }
    ```
    - `key`: Alice's current ratchet public key (as mentioned in [DR spec section 2.2](https://signal.org/docs/specifications/doubleratchet/#symmetric-key-ratchet));
    - `n`: number of the message in the sending chain;
    - `pn`: length of the previous sending chain;
    - `id`: Bob's bundle ID.

- `DH_header`: Diffie-Helman header (used when Bob's bundle is not available):
    ([protobuf](https://github.com/status-im/status-go/blob/features%2Fx3dh/services/shhext/chat/encryption.proto#L23))
    ``` protobuf
    message DHHeader {
      bytes key = 1;
    }
    ```
    - `key`: Alice's compressed ephemeral public key.

- `payload`:
    - if a bundle is available, contains payload encrypted with the Double Ratchet algorithm;
    - otherwise, payload encrypted with output key of DH exchange (no Perfect Forward Secrecy).
    -

# 3. Session Management

This section describe how sessions are handled.

A peer is identified by two pieces of data:

1) An `installation-id` which is generated upon creating a new account in the `Status` application
2) Their identity whisper key

## 3.1 Initializiation

A new session is initialized once a successful X3DH exchange has taken place.
Subsequent messages will use the established session until re-keying is necessary.

## 3.2 Concurrent sessions

If two sessions are created concurrently between two peers the one with the symmetric key first in byte order should be used, marking the other has expired (TO BE IMPLEMENTED).

## 3.3 Re-keying

On receiving a bundle from a given peer with a higher version, the old bundle should be marked as expired and a new session should be established on the next message sent.

## 3.4 Expired session

Expired session should not be used for new messages and should be deleted after 14 days from the expiration date (TO BE IMPLEMENTED), in order to be able to decrypt out-of-order and mailserver messages.

## 4. Multi-device support

Multi-device support is quite challenging as we don't have a central place where information on which and how many devices (identified by their respective `installation-id`) belongs to a whisper-identity.

Furthermore we always need to take account recovery in consideration, where the whole device is wiped clean and all the information about any previous sessions is lost.

Taking these considerations into account, the way multi-device information is propagated through the network is through bundles/contact codes, which will contain information about paired devices as well as information about the sending device.

This mean that every time a new device is paired, the bundle needs to be updated and propagated with the new information, and the burden is put on the user to make sure the pairing is successful.

## 4.1 Pairing

When a user adds a new account, a new `installation-id` will be generated. The device should be paired as soon as possible if other devices are present. Once paired the contacts will be notified of the new device and it will be included in further communications.

Any time a bundle from your $IK$ but different `installation-id` is received, the device is added to the pairing group. From now on any message sent by one device will also be sent to any device in the pairing group. Eventually devices will have to be explicitly confirmed by the user _(TO BE IMPLEMENTED)_.

Upon receiving a new bundle from it's own `$IK$` the following operation are performed:

1) For each signed-pre-key if the local version is < then the one received or is missing, the local version will be updated/added.
2) If the received bundle is missing the receiving installation-id, the bundle will be updated with the receiving installation-id and current signed-pre-key/version. 

After this step a new contact-code/bundle will be generated which will include pairing information.

The bundle will be propagated to contacts through contact updates. The user will be notified to update their contact-code in any other place where it might be stored. (TO BE IMPLEMENTED).

Removal of paired devices is a manual step that needs to be applied on each device (TO BE IMPLEMENTED).


## 4.2 Sending messages to a paired group

When sending a message, the peer will send a message to any `installation-id` that they have seen, using pairwise encryption, including their own devices.

The number of devices will be capped to a reasonable number,  ordered by last activity. (5, 10? TO BE IMPLEMENTED)

## 4.3 Stale devices (TO BE IMPLEMENTED)

When a bundle is received from $IK$ a timer is initiated on any `installation-id` belonging to $IK$ not included in the bundle. If after 7 days no bundles are received from these devices they are marked as `stale` and no message will be sent to them.

## 4.4 Account recovery

Account recovery is no different from adding a new device, and it is handled in exactly the same way.

## 4.5 Partitioned devices (TO BE IMPLEMENTED)

In some cases (i.e. account recovery when no other pairing device is available, device not paired), it is possible that a device will receive a message that is not targeted to its own `installation-id`.
In this case the user will be presented with a prompt, notifying them that $IK$ has sent them a message, and an option will be given to send a bundle back so that further communication
can happen.

# 4. Security Considerations

The same considerations apply as in [section 4 of the X3DH spec](https://signal.org/docs/specifications/x3dh/#security-considerations) and [section 6 of the Double Ratchet spec](https://signal.org/docs/specifications/doubleratchet/#security-considerations), with some additions detailed below.

**_TODO: Add any additional context here not covered in the X3DH and DR specs, e.g.:_**

