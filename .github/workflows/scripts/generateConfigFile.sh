#!/bin/bash

echo "export const config = {" > ../conf/sdConfig.ts
echo "    models: [" >> ../conf/sdConfig.ts
echo "        {" >> ../conf/sdConfig.ts
echo "            id: \"1\"," >> ../conf/sdConfig.ts
echo "            name: \"Beam Model\"," >> ../conf/sdConfig.ts
echo "            beamId: '${BEAM_APP_ID}'" >> ../conf/sdConfig.ts
echo "        }" >> ../conf/sdConfig.ts
echo "    ]," >> ../conf/sdConfig.ts
echo "    beam: {" >> ../conf/sdConfig.ts
echo "        authToken: '${BEAM_AUTH_TOKEN}'" >> ../conf/sdConfig.ts
echo "    }" >> ../conf/sdConfig.ts
echo "};" >> ../conf/sdConfig.ts
