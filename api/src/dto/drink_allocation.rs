use serde::Deserialize;
use typeshare::typeshare;

use crate::{domain::drink_allocation::DrinkAllocation, dto::player::PlayerIdentityDto};

#[typeshare]
#[derive(Debug, Deserialize)]
pub struct AssignDrinksRequest {
    pub allocations: Vec<DrinkAllocationDto>,
}

#[typeshare]
#[derive(Debug, Deserialize)]
pub struct DrinkAllocationDto {
    pub recipient: PlayerIdentityDto,
    pub amount: u16,
}

impl From<DrinkAllocationDto> for DrinkAllocation {
    fn from(value: DrinkAllocationDto) -> Self {
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
