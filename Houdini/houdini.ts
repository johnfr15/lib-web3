import axios  from "axios"


const houdini = async() => {

    const partnerID = '6526dd59afa7ce4444cb0795'; // Replace with your Partner ID
    const secret = 'rDHbDqGjyNfFTmvGuBTKCo'; // Replace with your Secret

    // Define the URL with query parameters
    const url = 'https://api-partner.houdiniswap.com/quote';
    const params = {
        amount: 1,
        from: 'ETH',
        to: 'USDC',
        anonymous: false,
    };



    axios.get(url, {
        params: params,
        headers: {
            'Authorization': `${partnerID}:${secret}`,
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        // Handle the response data here
        console.log('Response data:', response.data);
    })
    .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Error:', error.response.data);
    });
}



houdini()