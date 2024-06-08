#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <output_file>"
    exit 1
fi

OUTPUT_FILE=$1

echo "export const config = {" > $OUTPUT_FILE
echo "    models: [" >> $OUTPUT_FILE
echo "        {" >> $OUTPUT_FILE
echo "            id: \"1\"," >> $OUTPUT_FILE
echo "            name: \"Beam Model\"," >> $OUTPUT_FILE
echo "            beamId: '${BEAM_APP_ID}'" >> $OUTPUT_FILE
echo "        }" >> $OUTPUT_FILE
echo "    ]," >> $OUTPUT_FILE
echo "    beam: {" >> $OUTPUT_FILE
echo "        authToken: '${BEAM_AUTH_TOKEN}'" >> $OUTPUT_FILE
echo "    }" >> $OUTPUT_FILE
echo "};" >> $OUTPUT_FILE
