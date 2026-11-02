use uuid::Uuid;

pub struct Difficulty {
    id: Uuid,
    name: String,
    drinksPerRound: Vec<u8>,
}
