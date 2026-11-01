import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import "../../i18n/i18n";
import { PlayersTabSetup } from "./PlayersTabSetup";

it("renders saved avatars without changing player data during rendering", () => {
  const players = [
    Object.freeze({ name: "Alex", avatarSrc: "/players/avatar4.png" }),
    Object.freeze({ name: "Sam", avatarSrc: "/players/avatar3.png" }),
  ];

  const html = renderToStaticMarkup(
    <PlayersTabSetup
      players={players}
      onSetPlayerCount={() => {}}
      onSetPlayerName={() => {}}
      onChangeAvatar={() => {}}
    />,
  );

  expect(html).toContain("/players/avatar4.png");
  expect(html).toContain("/players/avatar3.png");
});
