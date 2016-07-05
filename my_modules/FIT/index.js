var async = require('async');
var fs = require('fs');

var FILE_ID = 0,
USER_PROFILE = 3,
SESSION = 18,
LAP = 19,
RECORD = 20;
EVENT = 21,
SOURCE = 22,
DEVICE_INFO = 23,
ACTIVITY = 34,
FILE_CREATOR = 49,
WTF = 99,
BATTERY = 104,
WTF2 = 113;

var GLOBAL_MESSAGES = {};

GLOBAL_MESSAGES[FILE_ID] = 'FILE_ID';
GLOBAL_MESSAGES[USER_PROFILE] = 'USER_PROFILE';
GLOBAL_MESSAGES[SESSION] = 'SESSION';
GLOBAL_MESSAGES[LAP] = 'LAP';
GLOBAL_MESSAGES[RECORD] = 'RECORD';
GLOBAL_MESSAGES[EVENT] = 'EVENT';
GLOBAL_MESSAGES[SOURCE] = 'SOURCE';
GLOBAL_MESSAGES[DEVICE_INFO] = 'DEVICE_INFO';
GLOBAL_MESSAGES[ACTIVITY] = 'ACTIVITY';
GLOBAL_MESSAGES[FILE_CREATOR] = 'FILE_CREATOR';
GLOBAL_MESSAGES[WTF] = 'WTF';
GLOBAL_MESSAGES[BATTERY] = 'BATTERY';
GLOBAL_MESSAGES[WTF2] = 'WTF2';

var ACTIVITY_FIELD_MESSAGES = {};

ACTIVITY_FIELD_MESSAGES[FILE_ID] = {
  0: 'type',
  1: 'manufacturer',
  2: 'product',
  3: 'serial_number',
  4: 'time_created',
  5: 'number',
};
ACTIVITY_FIELD_MESSAGES[USER_PROFILE] = {};
ACTIVITY_FIELD_MESSAGES[SESSION] = {
  0: 'event',
  1: 'event_type',
  2: 'start_time',
  3: 'start_position_lat',
  4: 'start_position_long',
  5: 'sport',
  6: 'sub_sport',
  7: 'total_elapsed_time',
  8: 'total_timer_time',
  9: 'total_distance',
  11: 'total_calories',
  13: 'total_fat_calories',
  14: 'avg_speed',
  24: 'total_training_effect',
  25: 'first_lap_index',
  26: 'num_laps',
  27: 'event_group',
  28: 'trigger',
  253: 'timestamp',
  254: 'message_index',
};
ACTIVITY_FIELD_MESSAGES[LAP] = {
  0: 'event',
  1: 'event_type',
  2: 'start_time',
  3: 'start_position_lat',
  4: 'start_position_long',
  5: 'end_position_lat',
  6: 'end_position_long',
  7: 'total_elapsed_time',
  8: 'total_timer_time',
  9: 'total_distance',
  10: 'total_strides',
  11: 'total_calories',
  12: 'total_fat_calories',
  13: 'avg_speed',
  14: 'max_speed',
  15: 'avg_heart_rate',
  16: 'max_heart_rate',
  24: 'lap_trigger',
  25: 'sport',
  253: 'timestamp',
  254: 'message_index',
};
ACTIVITY_FIELD_MESSAGES[RECORD] = {
  0: 'position_lat',
  1: 'position_long',
  2: 'altitude',
  3: 'heart_rate',
  4: 'cadence',
  5: 'distance',
  6: 'speed',
  253: 'timestamp',
};
ACTIVITY_FIELD_MESSAGES[EVENT] = {
  0: 'event',
  1: 'event_type',
  2: 'data16',
  3: 'data',
  4: 'event_group',
  253: 'timestamp',
};
ACTIVITY_FIELD_MESSAGES[SOURCE] = {
  0: 'source_field_0',
  1: 'source_field_1',
  5: 'source_field_5',
  253: 'timestamp',
};
ACTIVITY_FIELD_MESSAGES[DEVICE_INFO] = {
  0: 'device_index',
  1: 'device_type',
  2: 'manufacturer',
  3: 'serial_number',
  4: 'product',
  5: 'software_version',
  6: 'hardware_version',
  253: 'timestamp',
};
ACTIVITY_FIELD_MESSAGES[ACTIVITY] = {
  0: 'total_timer_time',
  1: 'num_sessions',
  2: 'type',
  3: 'event',
  4: 'event_type',
  5: 'local_timestamp',
  253: 'timestamp',
};
ACTIVITY_FIELD_MESSAGES[FILE_CREATOR] = {
  0: 'software_version',
  1: 'hardware_version',
};
ACTIVITY_FIELD_MESSAGES[WTF] = {};
ACTIVITY_FIELD_MESSAGES[BATTERY] = {
  0: 'battery_field_0',
  3: 'battery_field_3',
  253: 'battery_field_253',
};
ACTIVITY_FIELD_MESSAGES[WTF2] = {
  0: 'wft2_field_0',
  1: 'wft2_field_1',
  2: 'wft2_field_2',
  3: 'wft2_field_3',
  4: 'wft2_field_4',
  5: 'wft2_field_5',
  253: 'wft2_field_253',
};

var baseTypes = {
  0: {
    size: 1,
    value:function(buffer, position) {
      value = buffer.readUInt8(position);
      return value;
    }
  },
  1: {
    size:1,
    value:function(buffer, position) {
      value = buffer.readInt8(position);
      return value;
    }
  },
  2: {
    size:1,
    value:function(buffer, position) {
      value = buffer.readUInt8(position);
      return value;
    }
  },
  3: {
    size: 2,
    value:function(buffer, position) {
      value = buffer.readInt16LE(position);
      return value;
    }
  },
  4: {
    size: 2,
    value:function(buffer, position) {
      value = buffer.readUInt16LE(position);
      return value;
    }
  },
  5: {
    size: 4,
    value:function(buffer, position) {
      value = buffer.readInt32LE(position);
      return value;
    }
  },
  6: {
    size: 4,
    value:function(buffer, position) {
      value = buffer.readUInt32LE(position);
      return value;
    }
  },
  7: {
    size: 1,
    value:function(buffer, position) {
      value = buffer.toString('ASCII',position,position+1);
      return value;
    }
  },
  8: {
    size: 4,
    value:function(buffer, position) {
      value = buffer.readFloatLE(position);
      return value;
    }
  },
  9: {
    size: 8,
    value:function(buffer, position) {
      value = buffer.readDoubleLE(position);
      return value;
    }
  },
  10: {
    size: 1,
    value:function(buffer, position) {
      value = buffer.readUInt8(position);
      return value;
    }
  },
  11: {
    size: 2,
    value:function(buffer, position) {
      value = buffer.readUInt16LE(position);
      return value;
    }
  },
  12: {
    size: 4,
    value:function(buffer, position) {
      value = buffer.readUInt32LE(position);
      return value;
    }
  },
  13: {
    size: 1,
    value:function(buffer, position) {
      value = buffer[position];
      return value;
    }
  },
  14: {
    size: 2,
    value:function(buffer, position) {
      value = buffer.readUInt16LE(position);
      return value;
    }
  },
  15: {
    size: 2,
    value:function(buffer, position) {
      value = buffer.readUInt16LE(position);
      return value;
    }
  }
}

var Records = function(data){
  this.data = data;
};
Records.prototype.get = function(type) {
  if (typeof(type) == 'undefined') {
    return this.data;
  }
  var subset = [];
  this.data.forEach(function(record){
    if (record.type == type) {
      subset.push(record.data);
    }
  });
  return subset;
}

exports.read = function(file) {
  var buffer;

  function openFile(path) {
    var fd = fs.openSync(path, 'r');
    var stats = fs.statSync(path);
    fileSize = stats['size'];
    buffer = new Buffer(stats["size"]);
    fs.readSync(fd, buffer, 0, stats["size"], 0);
  }

  function increaseBufferIndex(amount) {
    marker += amount;
  }

  function getFileHeader() {
    var header = {
      HEADER_SIZE: buffer.readUInt8(0),
      PROTOCOL_VERSION: buffer.readUInt8(1),
      PROFILE_VERSION: buffer.readInt16LE(2),
      DATA_SIZE: buffer.readInt32LE(4),
      DATA_TYPE: buffer.toString('ascii',8,12),
      CRC: buffer.readInt16LE(12)
    }
    increaseBufferIndex(header.HEADER_SIZE);
    return header;
  }

  function getRecordCompressedTimestampHeader(position) {
    var header = {
      COMPRESSED_TIMESTAMP_HEADER: buffer.readUInt8(position)>>7 & 1,
      LOCAL_MESSAGE_TYPE: buffer.readUInt8(position)>>4 & (Math.pow(2,2)-1),
      TIME_OFFSET: buffer.readUInt8(position) & (Math.pow(2,5)-1),
    }
    increaseBufferIndex(1);
    return header;
  }

  function getRecordNormalHeader(position) {
    var header = {
      NORMAL_HEADER: buffer.readUInt8(position)>>7 & 1,
      MESSAGE_TYPE: buffer.readUInt8(position)>>6 & 1,
      LOCAL_MESSAGE_TYPE: buffer.readUInt8(position) & (Math.pow(2,4)-1)
    }
    increaseBufferIndex(1);
    return header;
  }

  function getDefinitionRecord(position) {
    var definition = {
      ARCHITECTURE: buffer.readUInt8(position+1),
      GLOBAL_MESSAGE_NUMBER: buffer.readInt16LE(position+2),
      FIELDS: buffer.readUInt8(position+4)
    }
    increaseBufferIndex(5);
    definition['FIELD_DEFINITIONS'] = getFieldDefinitions(definition.FIELDS);
    definition['GLOBAL_MESSAGE'] = GLOBAL_MESSAGES[definition.GLOBAL_MESSAGE_NUMBER];
    return definition;
  }

  function getFieldDefinitions(count) {
    var fieldDefinitions = [];
    for (var i = 0; i < count; i++) {
      var fieldDefinition = getFieldDefinition(marker);
      fieldDefinitions.push(fieldDefinition);
      increaseBufferIndex(3);
    }
    return fieldDefinitions;
  }

  function getFieldDefinition(position) {
    var definition = {
      FIELD_DEFINITION_NUMBER: buffer.readUInt8(position),
      SIZE: buffer.readUInt8(position+1),
      BASE_TYPE: buffer.readUInt8(position+2)
    }
    return definition;
  }

  function getBaseTypeField(byte){
    var field = {
      ENDIAN_ABILITY: byte>>7 & 1,
      BASE_TYPE_NUMBER: byte & (Math.pow(2,4)-1)
    }
    return field;
  }

  function getDataRecordContent(definition) {
    content = {};
    definition.FIELD_DEFINITIONS.forEach(function(fieldDefinition) {
      var baseTypeField = getBaseTypeField(fieldDefinition.BASE_TYPE);
      var value = baseTypes[baseTypeField.BASE_TYPE_NUMBER].value(buffer, marker);
      increaseBufferIndex(baseTypes[baseTypeField.BASE_TYPE_NUMBER].size);
      gmn = definition.GLOBAL_MESSAGE_NUMBER;
      dfn = fieldDefinition.FIELD_DEFINITION_NUMBER;
      var label;
      if (typeof(ACTIVITY_FIELD_MESSAGES[gmn]) == 'undefined') {
        console.log('undefined for GMN:'+gmn+' and DFN:'+dfn);
      }
      else {
        label = ACTIVITY_FIELD_MESSAGES[gmn][dfn];
        if (typeof(label) == 'undefined'){
          console.log('undefined for GMN:'+gmn+' and DFN:'+dfn);
        }
      }
      content[label] = value;
    });
    return content;
  }

  var DATA_MESSAGE_TYPE = 0;
  var DEFINITION_MESSAGE_TYPE = 1;
  var COMPRESSED_TIMESTAMP_HEADER = 1;
  var marker = 0;
  var dataRecords = [];
  var definitionRecords = {};
  var fileSize;
  var fileHeader;
  var recordCount;

  openFile(file);
  fileHeader = getFileHeader(marker);
  recordCount = 0;
  while ( marker < fileHeader.DATA_SIZE+fileHeader.HEADER_SIZE) {
    recordCount++;
    var recordHeaderType = buffer.readUInt8(marker)>>7 & 1;

    if (recordHeaderType == COMPRESSED_TIMESTAMP_HEADER) {
      var recordHeader = getRecordCompressedTimestampHeader(marker);
      var definition = definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE];
      var data = getDataRecordContent(definition);
      dataRecords.push(data);
    }
    else{
      var recordHeader = getRecordNormalHeader(marker);
      if (recordHeader.MESSAGE_TYPE == DEFINITION_MESSAGE_TYPE) {
        var definition = getDefinitionRecord(marker);
        definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE] = definition;
      }
      else if (recordHeader.MESSAGE_TYPE == DATA_MESSAGE_TYPE) {
        var definition = definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE];
        if (typeof(definition) !== 'undefined') {
          var data = getDataRecordContent(definition);
          dataRecords.push({
            type:GLOBAL_MESSAGES[definition.GLOBAL_MESSAGE_NUMBER],
            data:data
          });
        }
      }
    }
  }
  var records = new Records(dataRecords);
  return records;
}
