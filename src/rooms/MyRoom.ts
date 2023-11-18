import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      player.x = message.x;
      player.y = message.y;
      player.z = message.z;
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create instance of player (from schema)
    const player = new Player();

    // place Player at random location
    const FLOOR_SIZE = 500;
    player.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
    player.y = -1;
    player.z = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);

    // place player in the map of players using sessionId (unique per connection)
    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
