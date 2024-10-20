import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Deposit,
  MarketClosed,
  MarketCreated,
  OrderBookUpdated,
  OrderCancelled,
  OrderMatched,
  OrderPlaced,
  Withdraw
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

export function createMarketClosedEvent(
  marketId: BigInt,
  winningOutcome: i32
): MarketClosed {
  let marketClosedEvent = changetype<MarketClosed>(newMockEvent())

  marketClosedEvent.parameters = new Array()

  marketClosedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketClosedEvent.parameters.push(
    new ethereum.EventParam(
      "winningOutcome",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(winningOutcome))
    )
  )

  return marketClosedEvent
}

export function createMarketCreatedEvent(
  marketId: BigInt,
  name: string,
  rules: string,
  creator: Address,
  yesLabel: string,
  noLabel: string
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
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("rules", ethereum.Value.fromString(rules))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("yesLabel", ethereum.Value.fromString(yesLabel))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("noLabel", ethereum.Value.fromString(noLabel))
  )

  return marketCreatedEvent
}

export function createOrderBookUpdatedEvent(
  marketId: BigInt,
  yesOrders: Array<BigInt>,
  noOrders: Array<BigInt>
): OrderBookUpdated {
  let orderBookUpdatedEvent = changetype<OrderBookUpdated>(newMockEvent())

  orderBookUpdatedEvent.parameters = new Array()

  orderBookUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  orderBookUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "yesOrders",
      ethereum.Value.fromUnsignedBigIntArray(yesOrders)
    )
  )
  orderBookUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "noOrders",
      ethereum.Value.fromUnsignedBigIntArray(noOrders)
    )
  )

  return orderBookUpdatedEvent
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
  orderId: BigInt,
  matchedAmount: BigInt,
  price: BigInt
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
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam(
      "matchedAmount",
      ethereum.Value.fromUnsignedBigInt(matchedAmount)
    )
  )
  orderMatchedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return orderMatchedEvent
}

export function createOrderPlacedEvent(
  orderId: BigInt,
  marketId: BigInt,
  trader: Address,
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

export function createWithdrawEvent(user: Address, amount: BigInt): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEvent
}
