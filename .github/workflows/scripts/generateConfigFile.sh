#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <output_file>"
    exit 1
fi

if [ -z "$BEAM_APPS" ]; then
    echo "Environment variable BEAM_APPS is not set."
    exit 1
fi

if [ -z "$BEAM_AUTH_TOKEN" ]; then
    echo "Environment variable BEAM_AUTH_TOKEN is not set."
    exit 1
fi

OUTPUT_FILE=$1

echo "export const config = {" > $OUTPUT_FILE
echo "  beam: {" >> $OUTPUT_FILE
echo "    models: {" >> $OUTPUT_FILE

IFS=',' read -ra APPS <<< "$BEAM_APPS"
for APP in "${APPS[@]}"; do
    IFS='|' read -ra PAIR <<< "$APP"
    ID="${PAIR[0]}"
    NAME="${PAIR[1]}"
    echo "        \"$ID\": {" >> $OUTPUT_FILE
    echo "            name: \"$NAME\"" >> $OUTPUT_FILE
    echo "        }," >> $OUTPUT_FILE
done

# Remove the last comma to avoid syntax error in JSON
sed -i '$ s/,$//' $OUTPUT_FILE

echo "    }," >> $OUTPUT_FILE
echo "    authToken: '$BEAM_AUTH_TOKEN'" >> $OUTPUT_FILE
echo "  }" >> $OUTPUT_FILE
echo "};" >> $OUTPUT_FILE
