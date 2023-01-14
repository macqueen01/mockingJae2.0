import untar from "js-untar";
import Buffer from "buffer";
import { create } from "ipfs-http-client";

const client = create({
    host: "ipfs.io",
    port: 443,
    protocol: "https",
});


async function bufferToBlobs(buffer) {
    let urlList = [];
    let img_blobs = [];
    let data_blobs = [];

    // fills urlList with 0 in LENGTH
    for (let i = 0; i < length; i++) {
        urlList.push(0);
    }

    const files = await untar(buffer);

    for (let i = 0; i < files.length; i++) {
        if (
            files[i].name.endsWith(".jpeg") ||
            files[i].name.endsWith(".jpg")
        ) {
            const blob = blobbifyFile(files[i]);
            let index = blob.name.split("/").pop().split(".")[0] - 1;

            urlList[index] = { name: blob.name, url: blob.url };
            img_blobs.push(blob.img_blob);
            data_blobs.push(blob.data_blob);
        }
    }

    return {
        urlList: urlList,
        img_blobs: img_blobs,
        data_blobs: data_blobs,
    };
}

async function hashToTar(hash, http_client = client) {
    let tarArchive = Buffer.Buffer.alloc(0);

    // Send an HTTP GET request to the /api/v0/get endpoint to download the IPFS directory as a tar archive
    const tarArchiveBuffer = client.get(hash, { archive: true });
    for await (const chunk of tarArchiveBuffer) {
        tarArchive = Buffer.Buffer.concat([tarArchive, chunk]);
    }

    const buffer = new Uint8Array(tarArchive).buffer;

    return buffer;
}

export { bufferToBlobs, hashToTar };