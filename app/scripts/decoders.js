(function() {
  DECODERS = {
    'player:leave': function(dataView) {
      return dataView.getInt32(2);
    },
    'physics:reconciliation': function(dataView) {
      var data = {
        tick: dataView.getInt32(2),
        px: dataView.getFloat32(6),
        py: dataView.getFloat32(10),
        pz: dataView.getFloat32(14),
        rx: dataView.getFloat32(18),
        ry: dataView.getFloat32(22),
        rz: dataView.getFloat32(26)
      }
      return data;
    },
    'incoming.tick': function(dataView) {

      var players = [];

      BL.setServerTick(dataView.getInt32(2));

      var lowBits = dataView.getInt32(6);
      var highBits = dataView.getInt32(10);

      var long = new dcodeIO.Long(lowBits, highBits, true);
      BL.setServerTime(long.toString());

      var playersDataView = new DataView(dataView.buffer, 14);

      for (var i = 0; i < (playersDataView.byteLength / 28); i++) {
        var index = i * 28;

        var id = playersDataView.getInt32(index);

        if (id !== BL.getPlayer().id) {
          players.push({
            id: id,
            px: playersDataView.getFloat32((index += 4)),
            py: playersDataView.getFloat32((index += 4)),
            pz: playersDataView.getFloat32((index += 4)),
            rx: playersDataView.getFloat32((index += 4)),
            ry: playersDataView.getFloat32((index += 4)),
            rz: playersDataView.getFloat32((index += 4))
          });
        }
      }

      return players;
    },
    'session:start': function(dataView) {

      var session = {
        id: dataView.getInt32(2),
        objects: []
      }

      BL.setClientTick(dataView.getInt32(6))

      var objectsDataView = new DataView(dataView.buffer, 10);

      for (var i = 0; i < (objectsDataView.byteLength / 30); i++) {
        var index = i * 30;

        session.objects.push({
          id: objectsDataView.getInt32(index),
          type: objectsDataView.getInt16((index += 4)),
          px: objectsDataView.getFloat32((index += 2)),
          py: objectsDataView.getFloat32((index += 4)),
          pz: objectsDataView.getFloat32((index += 4)),
          rx: objectsDataView.getFloat32((index += 4)),
          ry: objectsDataView.getFloat32((index += 4)),
          rz: objectsDataView.getFloat32((index += 4))
        });
      }

      return session;
    }
  }
})();
