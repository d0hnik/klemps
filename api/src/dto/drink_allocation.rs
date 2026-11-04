use serde::Deserialize;
use typeshare::typeshare;

use crate::{domain::drink_allocation::DrinkAllocation, dto::player::PlayerIdentityDTO};

#[typeshare]
#[derive(Debug, Deserialize)]
pub struct AssignDrinksRequest {
    pub allocations: Vec<DrinkAllocationDTO>,
}

#[typeshare]
#[derive(Debug, Deserialize)]
pub struct DrinkAllocationDTO {
    pub recipient: PlayerIdentityDTO,
    pub amount: u16,
}

impl From<DrinkAllocationDTO> for DrinkAllocation {
    fn from(value: DrinkAllocationDTO) -> Self {
        Self {
            recipient: value.recipient.into(),
            amount: value.amount,
        }
    }
}

impl From<AssignDrinksRequest> for Vec<DrinkAllocation> {
    fn from(value: AssignDrinksRequest) -> Self {
        value.allocations.into_iter().map(Into::into).collect()
    }
}
