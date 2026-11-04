use serde::Deserialize;
use typeshare::typeshare;
use uuid::Uuid;

use crate::domain::{
    ids::{GuestId, UserId},
    player::PlayerIdentity,
};

#[typeshare]
#[derive(Debug, Deserialize)]
#[serde(tag = "kind", content = "id", rename_all = "snake_case")]
pub enum PlayerIdentityDto {
    Guest(#[typeshare(serialized_as = "String")] Uuid),
    User(#[typeshare(serialized_as = "String")] Uuid),
}

impl From<PlayerIdentityDto> for PlayerIdentity {
    fn from(value: PlayerIdentityDto) -> Self {
        match value {
            PlayerIdentityDto::Guest(id) => Self::Guest(GuestId::from_uuid(id)),
            PlayerIdentityDto::User(id) => Self::User(UserId::from_uuid(id)),
        }
    }
}
