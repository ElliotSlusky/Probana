import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Deposit,
  MarketCreated,
  MarketResolved,
  OrderCancelled,
  OrderMatched,
  OrderPlaced,
  WinningsClaimed,
  Withdrawal
} from "../generated/Probana/Probana"

export function createDepositEvent(user: Address, amount: BigInt): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositEvent
}

export function createMarketCreatedEvent(
  marketId: BigInt,
  question: string,
  rules: string
): MarketCreated {
  let marketCreatedEvent = changetype<MarketCreated>(newMockEvent())

  marketCreatedEvent.parameters = new Array()

  marketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromString(question))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("rules", ethereum.Value.fromString(rules))
  )

  return marketCreatedEvent
}

export function createMarketResolvedEvent(
  marketId: BigInt,
  winningOutcome: i32
): MarketResolved {
  let marketResolvedEvent = changetype<MarketResolved>(newMockEvent())

  marketResolvedEvent.parameters = new Array()

  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "winningOutcome",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(winningOutcome))
    )
  )

  return marketResolvedEvent
}

export function createOrderCancelledEvent(orderId: BigInt): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return orderCancelledEvent
}

export function createOrderMatchedEvent(
  marketId: BigInt,
  orderId1: BigInt,
  orderId2: BigInt,
  matchedAmount: BigInt
): OrderMatched {
  let orderMatchedEvent = changetype<OrderMatched>(newMockEvent())

  orderMatchedEvent.parameters = new Array()

  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId1",
      ethereum.Value.fromUnsignedBigInt(orderId1)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId2",
      ethereum.Value.fromUnsignedBigInt(orderId2)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "matchedAmount",
      ethereum.Value.fromUnsignedBigInt(matchedAmount)
    )
  )

  return orderMatchedEvent
}

export function createOrderPlacedEvent(
  orderId: BigInt,
  marketId: BigInt,
  trader: Address,
  side: i32,
  outcome: i32,
  amount: BigInt,
  price: BigInt
): OrderPlaced {
  let orderPlacedEvent = changetype<OrderPlaced>(newMockEvent())

  orderPlacedEvent.parameters = new Array()

  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "side",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(side))
    )
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "outcome",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(outcome))
    )
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return orderPlacedEvent
}

export function createWinningsClaimedEvent(
  marketId: BigInt,
  user: Address,
  amount: BigInt
): WinningsClaimed {
  let winningsClaimedEvent = changetype<WinningsClaimed>(newMockEvent())

  winningsClaimedEvent.parameters = new Array()

  winningsClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  winningsClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  winningsClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return winningsClaimedEvent
}

export function createWithdrawalEvent(
  user: Address,
  amount: BigInt
): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalEvent
}
