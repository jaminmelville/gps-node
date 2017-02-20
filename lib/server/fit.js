const fs = require('fs');

const FILE_ID = 0;
const USER_PROFILE = 3;
const SESSION = 18;
const LAP = 19;
const RECORD = 20;
const EVENT = 21;
const SOURCE = 22;
const DEVICE_INFO = 23;
const ACTIVITY = 34;
const FILE_CREATOR = 49;
const WTF = 99;
const BATTERY = 104;
const WTF2 = 113;

const GLOBAL_MESSAGES = {};

GLOBAL_MESSAGES[FILE_ID] = 'FILE_ID';
GLOBAL_MESSAGES[USER_PROFILE] = 'USER_PROFILE';
GLOBAL_MESSAGES[SESSION] = 'session';
GLOBAL_MESSAGES[LAP] = 'lap';
GLOBAL_MESSAGES[RECORD] = 'record';
GLOBAL_MESSAGES[EVENT] = 'event';
GLOBAL_MESSAGES[SOURCE] = 'SOURCE';
GLOBAL_MESSAGES[DEVICE_INFO] = 'DEVICE_INFO';
GLOBAL_MESSAGES[ACTIVITY] = 'ACTIVITY';
GLOBAL_MESSAGES[FILE_CREATOR] = 'FILE_CREATOR';
GLOBAL_MESSAGES[WTF] = 'WTF';
GLOBAL_MESSAGES[BATTERY] = 'BATTERY';
GLOBAL_MESSAGES[WTF2] = 'WTF2';

const ACTIVITY_FIELD_MESSAGES = {};

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

const baseTypes = {
  0: {
    size: 1,
    value: (buffer, position) => buffer.readUInt8(position, true),
  },
  1: {
    size: 1,
    value: (buffer, position) => buffer.readInt8(position, true),
  },
  2: {
    size: 1,
    value: (buffer, position) => buffer.readUInt8(position, true),
  },
  3: {
    size: 2,
    value: (buffer, position) => buffer.readInt16LE(position, true),
  },
  4: {
    size: 2,
    value: (buffer, position) => buffer.readUInt16LE(position, true),
  },
  5: {
    size: 4,
    value: (buffer, position) => buffer.readInt32LE(position, true),
  },
  6: {
    size: 4,
    value: (buffer, position) => buffer.readUInt32LE(position, true),
  },
  7: {
    size: 1,
    value: (buffer, position) => buffer.toString('ASCII', position, position + 1),
  },
  8: {
    size: 4,
    value: (buffer, position) => buffer.readFloatLE(position, true),
  },
  9: {
    size: 8,
    value: (buffer, position) => buffer.readDoubleLE(position, true),
  },
  10: {
    size: 1,
    value: (buffer, position) => buffer.readUInt8(position, true),
  },
  11: {
    size: 2,
    value: (buffer, position) => buffer.readUInt16LE(position, true),
  },
  12: {
    size: 4,
    value: (buffer, position) => buffer.readUInt32LE(position, true),
  },
  13: {
    size: 1,
    value: (buffer, position) => buffer[position],
  },
  14: {
    size: 2,
    value: (buffer, position) => buffer.readUInt16LE(position, true),
  },
  15: {
    size: 2,
    value: (buffer, position) => buffer.readUInt16LE(position, true),
  },
};


function read(file) {
  let buffer;
  let marker = 0;

  function openFile(path) {
    const fd = fs.openSync(path, 'r');
    const stats = fs.statSync(path);
    buffer = new Buffer(stats.size);
    fs.readSync(fd, buffer, 0, stats.size, 0);
  }

  function increaseBufferIndex(amount) {
    marker += amount;
  }

  function getFileHeader() {
    const header = {
      HEADER_SIZE: buffer.readUInt8(0),
      PROTOCOL_VERSION: buffer.readUInt8(1),
      PROFILE_VERSION: buffer.readInt16LE(2),
      DATA_SIZE: buffer.readInt32LE(4),
      DATA_TYPE: buffer.toString('ascii', 8, 12),
      CRC: buffer.readInt16LE(12),
    };
    increaseBufferIndex(header.HEADER_SIZE);
    return header;
  }

  function getRecordCompressedTimestampHeader(position) {
    const header = {
      COMPRESSED_TIMESTAMP_HEADER: buffer.readUInt8(position, true) >> 7 & 1,
      LOCAL_MESSAGE_TYPE: buffer.readUInt8(position, true) >> 4 & (Math.pow(2, 2) - 1),
      TIME_OFFSET: buffer.readUInt8(position, true) & (Math.pow(2, 5) - 1),
    };
    increaseBufferIndex(1);
    return header;
  }

  function getRecordNormalHeader(position) {
    const header = {
      NORMAL_HEADER: buffer.readUInt8(position, true) >> 7 & 1,
      MESSAGE_TYPE: buffer.readUInt8(position, true) >> 6 & 1,
      LOCAL_MESSAGE_TYPE: buffer.readUInt8(position, true) & (Math.pow(2, 4) - 1),
    };
    increaseBufferIndex(1);
    return header;
  }

  function getFieldDefinition(position) {
    const definition = {
      FIELD_DEFINITION_NUMBER: buffer.readUInt8(position, true),
      SIZE: buffer.readUInt8(position + 1),
      BASE_TYPE: buffer.readUInt8(position + 2),
    };
    return definition;
  }

  function getFieldDefinitions(count) {
    const fieldDefinitions = [];
    for (let i = 0; i < count; i += 1) {
      const fieldDefinition = getFieldDefinition(marker);
      fieldDefinitions.push(fieldDefinition);
      increaseBufferIndex(3);
    }
    return fieldDefinitions;
  }

  function getDefinitionRecord(position) {
    const definition = {
      ARCHITECTURE: buffer.readUInt8(position + 1),
      GLOBAL_MESSAGE_NUMBER: buffer.readInt16LE(position + 2),
      FIELDS: buffer.readUInt8(position + 4),
    };
    increaseBufferIndex(5);
    definition.FIELD_DEFINITIONS = getFieldDefinitions(definition.FIELDS);
    definition.GLOBAL_MESSAGE = GLOBAL_MESSAGES[definition.GLOBAL_MESSAGE_NUMBER];
    return definition;
  }

  function getBaseTypeField(byte) {
    const field = {
      ENDIAN_ABILITY: byte >> 7 & 1,
      BASE_TYPE_NUMBER: byte & (Math.pow(2, 4) - 1),
    };
    return field;
  }

  function getDataRecordContent(definition) {
    const content = {};
    definition.FIELD_DEFINITIONS.forEach((fieldDefinition) => {
      const baseTypeField = getBaseTypeField(fieldDefinition.BASE_TYPE);
      const value = baseTypes[baseTypeField.BASE_TYPE_NUMBER].value(buffer, marker);
      increaseBufferIndex(baseTypes[baseTypeField.BASE_TYPE_NUMBER].size);
      const gmn = definition.GLOBAL_MESSAGE_NUMBER;
      const dfn = fieldDefinition.FIELD_DEFINITION_NUMBER;
      let label;
      if (typeof (ACTIVITY_FIELD_MESSAGES[gmn]) === 'undefined') {
        // console.log('undefined for GMN:'+gmn+' and DFN:'+dfn);
      } else {
        label = ACTIVITY_FIELD_MESSAGES[gmn][dfn];
        if (typeof (label) === 'undefined') {
          // console.log('undefined for GMN:'+gmn+' and DFN:'+dfn);
        }
      }
      content[label] = value;
    });
    return content;
  }

  const DATA_MESSAGE_TYPE = 0;
  const DEFINITION_MESSAGE_TYPE = 1;
  const COMPRESSED_TIMESTAMP_HEADER = 1;
  const dataRecords = [];
  const definitionRecords = {};

  openFile(file);
  const fileHeader = getFileHeader(marker);
  while (marker < fileHeader.DATA_SIZE + fileHeader.HEADER_SIZE) {
    const recordHeaderType = buffer.readUInt8(marker, true) >> 7 & 1;

    if (recordHeaderType === COMPRESSED_TIMESTAMP_HEADER) {
      const recordHeader = getRecordCompressedTimestampHeader(marker);
      const definition = definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE];
      const data = getDataRecordContent(definition);
      dataRecords.push(data);
    } else {
      const recordHeader = getRecordNormalHeader(marker);
      if (recordHeader.MESSAGE_TYPE === DEFINITION_MESSAGE_TYPE) {
        const definition = getDefinitionRecord(marker);
        definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE] = definition;
      } else if (recordHeader.MESSAGE_TYPE === DATA_MESSAGE_TYPE) {
        const definition = definitionRecords[recordHeader.LOCAL_MESSAGE_TYPE];
        if (typeof (definition) !== 'undefined') {
          const data = getDataRecordContent(definition);
          dataRecords.push({
            type: GLOBAL_MESSAGES[definition.GLOBAL_MESSAGE_NUMBER],
            data,
          });
        }
      }
    }
  }
  return dataRecords;
}

export default function fit(path) {
  const result = read(path);
  return result;
}
