<style>

    
    .set-post-file-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 80%;
        margin: 0;
        padding: 0;
    }
    
    .sub-navbar-wrap {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
         
    }
    
    .sub-navbar-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .sub-navbar-right {
        transform: scaleX(-1);
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .nav-left, .nav-right {
        background-image: url('/icons/svgs/arrowToLeft.svg');
        background-size: cover;
        background-color: transparent;
        border: none;
        height: 50px;
        width: 50px;      
    }
    
    .nav-left:active, .nav-right:active {
        background-color: transparent;
        border: none;
    }
    
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width :100%;
        margin: 0;
        padding: 0;
        
    }
    
    .title-field, .title-field:focus {
        background-color: transparent;
        border: none;
        outline: none;
    }
    
    .field-wrap {
        width: fit-content;
        height: fit-content;
        display: flex hidden;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        background-color: transparent;
        
    }
    
    .form-wrap {
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .questionair-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 65%;
        height: 40%;
        font-size: 20px;
        text-align: center;
    }
    
    .file-field {
        display: none;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-bottom: 3px;
        font-size: 20px;
        font-family: popRegular;
    }
    
    .title-requirement-container {
        width: 60%;
        height: 150px;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    p {
        font-family: popRegular;
        font-size: 12px;
        padding: 0;
        margin: 0;
        padding-left: 3px;
        padding-bottom: 20px;
    }
    
    :global(h1) {
        font-family: popRegular;
        font-size: 25px;
        color: gray;
    }
    
    :global(h2) {
        font-family: popRegular;
        font-size: 20px;
    }
    
    .requirement-wrap {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        color: red;
    }
    
    .icon-wrap {
        height: 100%;
        width: fit-content;
        padding-right: 5px;
    }

    .requirement-wrap-check {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        color: #3acc37;
    }
    
    .upload-wrap {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: popRegular;
        font-size: 14px;
    }
    
    .btn-container {
        height: 30%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-top: 20px;
    }

    .upload-btn-from-device {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #413c47;
        color: rgb(224, 221, 221);
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
    }

    .upload-btn-from-memehouse {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fdf9e6;
        color: #413c47;
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        border: thin solid #59545f
    }
    
    .meme-house-menu {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 20;
        background-color: whitesmoke;
    }
    
    .meme-house-nav-bar {
        height: 13%;
        width: 100%;
        border-bottom: thin solid #59545f;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    
    .left-nav-wrap {
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        margin-left: 5px; 
    }
    
    .meme-nav-right {
        transform: scaleX(-1);
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .meme-nav-left {
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .meme-house-icon-container {
        width: 60%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0; 
    }
    
    .right-nav-wrap {
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        margin-right: 5px; 
    }
    
    .meme-container {
        width: 100%;
        height: 67%;
        display: grid;
        grid-template-columns: 150px 150px;
        overflow-y: auto;
        
    }
    
    .meme-house-panel {
        width: 100%;
        height: 20%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: start;
        margin: 0;
        padding: 0;
        background-color: #242424;
    }
    
    .title-wrap {
        position: absolute;
        top: 0;
        left: auto;
        right: auto;
        height: 80%;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
    }
    
    .meme-title {
        font-family: popLight;
        font-size: 13px;
        text-align: center;
        color: white;
    }
    
    .meme-crafter {
        font-family: popExtraLight;
        font-size: 9px;
        text-align: center;
        color: white;
        bottom: 3px;
        right: 5px;
        margin: 0;
        padding: 0;
        color: gray;
        position: absolute;
    }
    
    .requirement-wrap {
        
    }
    
    .meme {
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        position: relative;
    }
    
    .facad {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgba(36, 36, 36, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    
    

</style>


<script>
    import { onMount } from 'svelte';


    export let stage = 0;
    // let FILE be either of two forms:
    //      - a file object passed from file input. 
    //        This case, is_local should be set false
    //      - a customed meme object with attributes described bellow.
    //        This case, is_local should be set true
    //              @ id: id of meme uniquely set                    (INT)
    //              @ thumbnail: file object                         (FILE)
    //              @ title: title of the meme                       (STR)
    //              @ crafter: id of User created the meme           (INT)
    //              @ approved: if meme object is approved by Jae    (BOOL)
    //              @ src: source of the file object                 (STR)
    export let file;
    
    
    export let is_local = false;
    let memes = [];
    let meme_selected_index;
    let meme_selected_id;
    let preview_src = "";
    
    for (let i = 0; i < 10; i++) {
        memes.push({
            id: i,
            thumbnail: "HI",
            title: 'This is title of meme',
            crafter: "Jae",
            approved: true,
            src: "/icons/svgs/Global_panel.svg"
        });
    }
    console.log(memes);
    
    onMount(() => {
        if (memes) {
            meme_selected_index = 0;
            meme_selected_id = memes[0].id;
        }
    })
    
    
    $: {
        if (meme_house_open && memes) {
            let meme_selected_index = 0;
            let meme_selected_id = memes[0].id
        }
    }
    
    $: {
        if (file && !is_local) {
            preview_src = URL.createObjectURL(file[0])
        } else if (file && is_local) {
            preview_src = file.src; 
        }
    }
    
    let meme_house_open = false;
    


    import { createEventDispatcher } from 'svelte';
    import { slide, fade, draw } from 'svelte/transition';
    import { quintOut, quintIn } from 'svelte/easing';
    
    var dispatch = createEventDispatcher();

    function bubbleUpFile() {
        console.log("bubble up file...")
        stage = 1;

        dispatch('postFile', {
            file: file,
            stage: stage,
            is_local: is_local
        })
    }
    
    function callToMemeHouse() {
        meme_house_open = true;  
        console.log("clicked!", meme_house_open);
    }
    
    function selectMeme(index, meme_id) {
        if (memes[index].id != meme_id) {
            console.log('error: the id of passed meme and id of selected meme is different:', memes[index].id, meme_id);
        } else {
            meme_selected_index = index;
            meme_selected_id = meme_id;
            console.log("id matches:", meme_id, memes[index].id)
        }
    }
    
    function goBack() {
        meme_house_open = false;
    }
    
    function goForth() {
        meme_house_open = false;
        is_local = true;
        file = memes[meme_selected_index];
        console.log("meme selected :", file, "local :", is_local);
    }
    
    function initHandler() {
        if (!is_local) {
            URL.revokeObjectURL(preview_src);
            preview_src = "";
        } else {
            is_local = false
        }
        file = null;
    }
    




</script>

{#if meme_house_open}
    <div class="meme-house-menu" in:slide={{duration:600, easing: quintOut}} out:slide={{duration:600, easing: quintIn}}>
        <div class="meme-house-nav-bar">
            <div class="left-nav-wrap">
                <div class="meme-nav-left" on:click={goBack}>
                    <img src="/icons/svgs/arrowToLeft.svg" height="30px">
                </div>
            </div>
            <div class="meme-house-icon-container">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30px" height="30px" viewBox="0 0 1584.000000 1584.000000"
 preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,1584.000000) scale(0.100000,-0.100000)"
fill="#59545f" stroke="none">
                        <path d="M7172 14295 c-72 -23 -165 -101 -482 -401 -36 -34 -83 -78 -105 -99
-22 -20 -94 -89 -160 -153 -560 -540 -631 -609 -785 -752 -323 -300 -775 -686
-1282 -1094 -65 -52 -173 -141 -323 -266 -585 -486 -1069 -878 -1340 -1086
-427 -327 -709 -534 -1375 -1012 -236 -170 -399 -289 -440 -322 -25 -20 -106
-83 -180 -141 -321 -248 -557 -472 -620 -589 -31 -59 -34 -73 -34 -145 0 -96
20 -142 88 -202 85 -75 209 -121 546 -204 113 -27 234 -57 270 -65 36 -8 83
-19 105 -24 22 -5 67 -15 100 -21 33 -6 94 -17 135 -26 114 -22 228 -43 300
-54 36 -5 72 -11 80 -14 19 -6 180 -30 470 -70 58 -8 146 -21 195 -29 50 -8
122 -19 160 -25 39 -6 88 -16 110 -21 l40 -11 1 -147 c1 -81 7 -160 13 -175
14 -36 15 -374 1 -592 -10 -162 -23 -418 -40 -780 -5 -110 -14 -267 -19 -350
-6 -82 -18 -274 -26 -425 -9 -151 -20 -342 -26 -425 -23 -353 -41 -1087 -35
-1435 14 -885 61 -1164 223 -1328 59 -59 131 -97 219 -113 66 -13 354 -6 444
11 110 20 469 30 740 20 146 -5 279 -12 297 -15 37 -7 324 -29 638 -51 238
-16 703 -33 721 -27 12 4 12 11 33 1008 16 744 34 902 167 1480 130 564 182
730 331 1045 102 216 328 572 420 662 80 79 348 267 458 321 158 79 176 82
455 80 287 -3 351 -13 485 -78 138 -67 196 -125 347 -345 106 -155 205 -325
238 -410 17 -44 44 -138 61 -208 16 -70 47 -199 69 -287 35 -144 52 -236 120
-660 23 -144 64 -482 80 -655 14 -150 41 -316 74 -448 35 -138 52 -239 80
-467 52 -414 79 -573 141 -825 18 -74 41 -172 50 -217 17 -80 19 -83 49 -87
121 -19 2769 -23 3276 -5 415 14 528 73 605 316 38 120 45 250 55 1008 15
1074 4 1541 -55 2450 -21 325 -43 806 -50 1105 -6 245 -30 873 -39 1031 l-5
77 31 6 c17 3 117 11 222 16 105 5 263 14 351 20 88 5 279 17 425 25 1282 74
1550 149 1528 423 -4 39 -13 65 -39 102 -63 90 -359 393 -654 670 -165 155
-546 491 -708 623 -55 45 -119 98 -141 117 -23 19 -60 49 -82 66 -415 332
-520 417 -620 500 -119 98 -325 274 -334 284 -3 3 -54 48 -115 100 -118 101
-154 134 -250 220 -33 30 -101 91 -150 135 -49 44 -119 107 -155 140 -36 33
-99 89 -140 125 -41 36 -99 88 -130 115 -30 28 -84 75 -120 105 -35 30 -85 73
-110 95 -64 58 -238 205 -276 235 -64 50 -279 225 -284 231 -6 7 -295 222
-365 271 -324 226 -670 445 -955 605 -56 32 -200 112 -260 145 -161 90 -498
266 -820 431 -564 287 -747 391 -1186 673 -110 71 -209 134 -220 141 -79 50
-214 117 -279 138 -86 28 -164 31 -233 10z"/>
                    </g>
                </svg>
            </div>
            <div class="right-nav-wrap">
                <div class="meme-nav-right" on:click={goForth}>
                    <img src="/icons/svgs/arrowToLeft.svg" height="30px">
                </div>
            </div>
        </div>
        {#if memes}
            <div class="meme-container">
                {#each memes as meme, index}
                    <div class="meme" id="meme-{index}" on:click={() => {selectMeme(index, meme.id)}}>
                        <img src={meme.src} height="150px" width="150px" alt="{meme.title}">
                        {#if meme_selected_index == index}
                            <div class="facad" transition:fade|local={{duration: 500, easing: quintOut}}>
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="50px" height="50px" viewBox="0 0 1584.000000 1584.000000"
 preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,1584.000000) scale(0.100000,-0.100000)"
fill="#f5f5f5" stroke="none">
                                        <path transition:draw|local={{duration: 1200, delay: 3000, easing: quintOut}} d="M8128 15401 c-90 -30 -160 -103 -173 -181 -19 -110 55 -220 167 -248
24 -6 174 -13 333 -16 310 -6 454 -15 715 -47 1439 -173 2790 -790 3842 -1755
53 -49 185 -170 294 -269 417 -378 608 -596 857 -976 342 -522 672 -1247 862
-1894 146 -498 280 -1210 316 -1685 15 -204 6 -756 -15 -950 -94 -831 -314
-1626 -681 -2455 -145 -327 -378 -750 -613 -1110 -351 -539 -870 -1104 -1409
-1536 -311 -249 -780 -582 -1038 -736 -590 -354 -1247 -608 -2039 -788 -409
-92 -598 -117 -1016 -135 -739 -30 -1299 11 -2005 146 -609 118 -1231 335
-1800 628 -797 412 -1374 877 -2031 1636 -918 1062 -1474 2309 -1648 3700 -44
348 -51 462 -51 810 1 333 8 479 46 850 69 685 220 1277 511 2000 351 871 800
1589 1405 2245 169 184 493 498 658 640 684 588 1403 992 2393 1346 464 166
1208 350 1637 404 105 13 202 28 216 34 14 5 38 24 53 42 38 45 33 110 -12
150 -44 40 -92 43 -334 25 -445 -34 -787 -80 -1045 -141 -168 -40 -545 -149
-722 -210 -1000 -344 -2119 -1059 -2931 -1874 -721 -724 -1368 -1701 -1724
-2604 -266 -673 -462 -1537 -516 -2272 -21 -297 -9 -922 25 -1298 161 -1737
991 -3482 2184 -4591 575 -535 1284 -1024 1945 -1341 726 -348 1556 -596 2261
-674 314 -35 511 -45 860 -45 454 1 650 21 1290 134 555 97 897 190 1380 372
612 232 1345 610 1803 930 729 511 1481 1298 2050 2149 426 638 786 1437 962
2139 106 424 179 868 216 1320 21 262 30 1033 15 1341 -26 546 -107 1003 -277
1567 -232 770 -547 1390 -1100 2172 -432 611 -660 892 -902 1114 -1222 1118
-2712 1772 -4382 1921 -199 18 -791 29 -832 16z"/>
                                        <path transition:draw|local={{duration: 1200, delay: 900, easing: quintOut}} d="M12795 11610 c-116 -25 -259 -95 -387 -192 -270 -204 -1025 -895
-1453 -1329 -769 -781 -1516 -1719 -2300 -2889 -539 -805 -1140 -1822 -1805
-3055 -371 -689 -749 -1364 -805 -1438 -10 -14 -20 -17 -37 -12 -35 11 -332
316 -424 435 -223 287 -437 638 -888 1448 -553 995 -857 1614 -1231 2507 -161
382 -225 566 -285 810 -28 114 -60 225 -70 246 -53 104 -138 154 -249 147
-153 -9 -224 -83 -508 -525 -295 -459 -410 -658 -628 -1088 -184 -363 -275
-580 -275 -658 0 -72 19 -119 69 -168 72 -72 156 -88 247 -45 68 31 108 84
140 181 82 246 408 872 681 1305 75 118 147 234 162 258 14 23 30 41 35 39 5
-2 34 -77 66 -167 71 -205 119 -324 308 -765 333 -778 636 -1384 1160 -2325
603 -1083 834 -1431 1182 -1781 160 -162 276 -254 390 -308 70 -33 82 -36 170
-36 83 0 101 3 145 26 100 53 200 183 372 484 144 252 436 782 676 1226 451
835 689 1254 1163 2040 753 1249 1611 2425 2459 3369 236 262 801 820 1165
1150 695 629 752 685 829 814 40 66 76 163 86 228 6 39 4 49 -14 67 -25 25
-30 25 -146 1z"/>
                                    </g>
                                </svg>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <div class="meme-container-no-meme">
            </div>
        {/if}
        <div class="meme-house-panel">
            <div class="title-wrap">
                <h4 class="meme-title">
                    {#if memes && meme_house_open}
                        {memes[meme_selected_index].title}
                        {#if memes[meme_selected_index].approved}
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="11px" height="11px" viewBox="0 0 1584.000000 1584.000000"
 preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,1584.000000) scale(0.100000,-0.100000)"
fill="#3acc37" stroke="none">
                                    <path transition:draw|local={{duration: 1200, delay: 3000, easing: quintOut}} d="M8128 15401 c-90 -30 -160 -103 -173 -181 -19 -110 55 -220 167 -248
24 -6 174 -13 333 -16 310 -6 454 -15 715 -47 1439 -173 2790 -790 3842 -1755
53 -49 185 -170 294 -269 417 -378 608 -596 857 -976 342 -522 672 -1247 862
-1894 146 -498 280 -1210 316 -1685 15 -204 6 -756 -15 -950 -94 -831 -314
-1626 -681 -2455 -145 -327 -378 -750 -613 -1110 -351 -539 -870 -1104 -1409
-1536 -311 -249 -780 -582 -1038 -736 -590 -354 -1247 -608 -2039 -788 -409
-92 -598 -117 -1016 -135 -739 -30 -1299 11 -2005 146 -609 118 -1231 335
-1800 628 -797 412 -1374 877 -2031 1636 -918 1062 -1474 2309 -1648 3700 -44
348 -51 462 -51 810 1 333 8 479 46 850 69 685 220 1277 511 2000 351 871 800
1589 1405 2245 169 184 493 498 658 640 684 588 1403 992 2393 1346 464 166
1208 350 1637 404 105 13 202 28 216 34 14 5 38 24 53 42 38 45 33 110 -12
150 -44 40 -92 43 -334 25 -445 -34 -787 -80 -1045 -141 -168 -40 -545 -149
-722 -210 -1000 -344 -2119 -1059 -2931 -1874 -721 -724 -1368 -1701 -1724
-2604 -266 -673 -462 -1537 -516 -2272 -21 -297 -9 -922 25 -1298 161 -1737
991 -3482 2184 -4591 575 -535 1284 -1024 1945 -1341 726 -348 1556 -596 2261
-674 314 -35 511 -45 860 -45 454 1 650 21 1290 134 555 97 897 190 1380 372
612 232 1345 610 1803 930 729 511 1481 1298 2050 2149 426 638 786 1437 962
2139 106 424 179 868 216 1320 21 262 30 1033 15 1341 -26 546 -107 1003 -277
1567 -232 770 -547 1390 -1100 2172 -432 611 -660 892 -902 1114 -1222 1118
-2712 1772 -4382 1921 -199 18 -791 29 -832 16z"/>
                                    <path transition:draw|local={{duration: 1200, delay: 900, easing: quintOut}} d="M12795 11610 c-116 -25 -259 -95 -387 -192 -270 -204 -1025 -895
-1453 -1329 -769 -781 -1516 -1719 -2300 -2889 -539 -805 -1140 -1822 -1805
-3055 -371 -689 -749 -1364 -805 -1438 -10 -14 -20 -17 -37 -12 -35 11 -332
316 -424 435 -223 287 -437 638 -888 1448 -553 995 -857 1614 -1231 2507 -161
382 -225 566 -285 810 -28 114 -60 225 -70 246 -53 104 -138 154 -249 147
-153 -9 -224 -83 -508 -525 -295 -459 -410 -658 -628 -1088 -184 -363 -275
-580 -275 -658 0 -72 19 -119 69 -168 72 -72 156 -88 247 -45 68 31 108 84
140 181 82 246 408 872 681 1305 75 118 147 234 162 258 14 23 30 41 35 39 5
-2 34 -77 66 -167 71 -205 119 -324 308 -765 333 -778 636 -1384 1160 -2325
603 -1083 834 -1431 1182 -1781 160 -162 276 -254 390 -308 70 -33 82 -36 170
-36 83 0 101 3 145 26 100 53 200 183 372 484 144 252 436 782 676 1226 451
835 689 1254 1163 2040 753 1249 1611 2425 2459 3369 236 262 801 820 1165
1150 695 629 752 685 829 814 40 66 76 163 86 228 6 39 4 49 -14 67 -25 25
-30 25 -146 1z"/>
                                </g>
                            </svg>
                        {/if}
                    {:else}
                        Quite Quiet isn't it...?
                    {/if}
                </h4>
            </div>
            <h4 class="meme-crafter">
                {#if memes && meme_house_open}
                    - Crafter, {memes[meme_selected_index].crafter}
                {:else}
                    - Architect, Jae
                {/if}
            </h4>
            <div class="requirement-wrap"></div>
        </div>
    </div>
{/if}



<div class="set-post-file-wrap">
    <div class="container">
        <div class="questionair-container">
            {#if !file}
                <h2>Share your piece of meme</h2>
            {:else}
                <h2>Such Memeful Beauty!</h2>
            {/if}
        </div>
        
        {#if file}
            <div class="preview-meme">
                <img src={preview_src} width="150px" height="150px"/>
            </div>
        {:else}
            <div class="form-wrap">
                <div class="upload-wrap">
                    Choose from
                    <div class="btn-container">
                        <label class="upload-btn-from-device" for="file" on:click={initHandler}>
                            <h4 class="label-device">
                                Gallery
                            </h4>
                        </label>
                    </div>
                    <div class="btn-container">
                        <div class="upload-btn-from-memehouse" on:click={callToMemeHouse}>
                            <label class="label-memehouse">
                                Meme House
                            </label>
                        </div>
                    </div>
                </div>
                <div class="field-wrap">
                    <input id="file" type="file" name="file" class="file-field" bind:files={file}/>
                </div>
            </div>
        {/if}
    </div>      
</div>

<div class="sub-navbar-wrap">
    <div class="sub-navbar-left">
        {#if file}
            <button class="nav-left" on:click={initHandler}></button>
        {/if}
    </div>
    <div class="sub-navbar-right">
        {#if (stage == 0) && file}
            <button class="nav-right" on:click={bubbleUpFile}></button>
        {/if}
    </div>
</div>

