use klemps_api::{
    domain::{
        drink_allocation::DrinkAllocation,
        ids::{GuestId, UserId},
        player::PlayerIdentity,
    },
    dto::drink_allocation::AssignDrinksRequest,
};
use serde_json::json;
use uuid::Uuid;

#[test]
fn request_maps_guest_and_user_recipients_to_domain_allocations() {
    let guest_id = Uuid::from_u128(1);
    let user_id = Uuid::from_u128(2);
    let request: AssignDrinksRequest = serde_json::from_value(json!({
        "allocations": [
            { "recipient": { "kind": "guest", "id": guest_id.to_string() }, "amount": 2 },
            { "recipient": { "kind": "user", "id": user_id.to_string() }, "amount": 1 }
        ]
    }))
    .unwrap();

    let allocations: Vec<DrinkAllocation> = request.into();

    assert_eq!(
        allocations,
        vec![
            DrinkAllocation {
                recipient: PlayerIdentity::Guest(GuestId::from_uuid(guest_id)),
                amount: 2,
            },
            DrinkAllocation {
                recipient: PlayerIdentity::User(UserId::from_uuid(user_id)),
                amount: 1,
            },
        ]
    );
}

#[test]
fn invalid_uuid_is_rejected_for_both_identity_kinds() {
    for kind in ["guest", "user"] {
        let result = serde_json::from_value::<AssignDrinksRequest>(json!({
            "allocations": [
                { "recipient": { "kind": kind, "id": "invalid-uuid" }, "amount": 1 }
            ]
        }));

        assert!(result.is_err(), "Invalid UUID accepted for {kind}");
    }
}

#[test]
fn missing_or_unknown_recipient_identity_is_rejected() {
    for recipient in [
        json!({ "kind": "other", "id": Uuid::from_u128(1).to_string() }),
        json!({ "kind": "guest" }),
        json!({ "id": Uuid::from_u128(1).to_string() }),
    ] {
        let result = serde_json::from_value::<AssignDrinksRequest>(json!({
            "allocations": [{ "recipient": recipient, "amount": 1 }]
        }));

        assert!(result.is_err());
    }
}

#[test]
fn invalid_drink_amounts_are_rejected() {
    for amount in [json!(-1), json!(65536), json!(1.5), json!("2")] {
        let result = serde_json::from_value::<AssignDrinksRequest>(json!({
            "allocations": [{
                "recipient": { "kind": "guest", "id": Uuid::from_u128(1).to_string() },
                "amount": amount
            }]
        }));

        assert!(result.is_err());
    }
}

#[test]
fn allocation_list_and_each_amount_are_required() {
    for payload in [
        json!({}),
        json!({ "allocations": null }),
        json!({
            "allocations": [{
                "recipient": { "kind": "guest", "id": Uuid::from_u128(1).to_string() }
            }]
        }),
    ] {
        assert!(serde_json::from_value::<AssignDrinksRequest>(payload).is_err());
    }
}
