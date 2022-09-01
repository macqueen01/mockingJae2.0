

<style>
    
    .home-container {
        width: 100%;
        min-height: 170vw;
        background-color: whitesmoke;
        padding: 0;
        margin: 0;
        
    }
    
    .blog-header {
      width: 100%;
      height: 20vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;
      background-color: white;
      position: relative;
    }
    
    .bloggers {
        width: 100px;
        height: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin: 0;
        padding: 0;
        z-index: 3;
    }
    
    
    .blogger {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background-color: whitesmoke;
        margin: 0;
        padding: 0;
    }
    
    .blogger-default {
        position: relative;
        z-index: 3;
    }
    
    .blogger-company-1 {
        position: absolute;
        left: 40px;
        z-index: 2;
    }
    
    .blogger-company-2 {
        position: absolute;
        z-index: 1;
        left: 60px;
    }
    
    
    .title-date-dm-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 260px;
        height: 100%;
    }
    
    .title-date-wrap {
        width: 75%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    .dm-wrap {
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: end;
    }
    
    .blog {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100vw;
      background-color: transparent;
    }
    
    .memes {
      width: 100%;
      min-height: 50vw;
      display: grid;
      grid-template-columns: 25vw 25vw 25vw 25vw;
      grid-template-rows: 25vw 25vw;
    }
    
    .show-memes {
      width: 100%;
      height: fit-content;
      display: grid;
      grid-template-columns: 50vw 50vw;
    }
    
    .rest-meme {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vw;
        width: 50vw;
        margin: 0;
        padding: 0;
    }
    
    .first-meme {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
        position: relative;
    }
    
    .second-meme {
        grid-column: 3 / 4;
        grid-row: 1 / 2;
        position: relative;
    }
    
    .third-meme {
        grid-column: 4 / 5;
        grid-row: 1 / 2;
        position: relative;
    }
    
    .forth-meme {
        gird-column: 3 / 4;
        grid-row: 2 / 3;
        position: relative;
    }
    
    .add-meme {
        grid-column: 4 / 5;
        grid-row: 2 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    
    .add-meme-in-show-meme {
        width: 50vw;
        height: 50vw;
        margin: 0;
        padding: 0;
        justify-content: space-around;
        align-items: center;
        display: flex;
        flex-direction: row;
    }
    
    .sample {
        height: 100%;
        width: 100%;
    }
    
    .title-wrap {
        width: 100%;
        height: 75%;
        font-family: popRegular;
        margin: 0;
        padding: 0;
        position: relative;
        
    }
    
    .title-container-long {
        margin: 0;
        padding: 0;
        align-items: center;
        display: flex;
        font-size: 14px;
        text-align: center;
        height: 100%;
        width: 100%;
        margin-top: 5px;
    }
    
    .title-container-short {
        
    }
    
    .date-wrap {
        width: 100%;
        height: 25%;
        font-size: 11px;
        text-align: end;
        color: #8c8c8c;
    }
    
    
    .extended-title {
        position: absolute;
        width: 100vw;
        height: 100%;
        background-color: #242424;
        top: 20vw;
        z-index: 6;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .title {
        width: fit-content;
        height: fit-content;
        text-align: center;
        justify-content: center;
        font-size: 15px;
        font-family: popRegular;
        color: whitesmoke;
    }
    
    
    .meme {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: rgba(36, 36, 36, 0.3);
        position: absolute;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        top: 0;
        
    }

    
</style>


<script>
    import { onMount } from 'svelte';
    import { fade, fly, slide, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { createEventDispatcher } from 'svelte';
    
    export let blogger = "Jae";
    export let title = "mocking jae mocking jay";
    export let memes = [1,2,3,4];
    export let blog = "/icons/svgs/Global_panel.svg";
    export let date = "2022.12.12";
    export let meme_id = 1;
    
    
    let TITLE;
    let EXTENDEDTITLE;
    var dispatch = createEventDispatcher();
    
    $: first = false;
    $: second = false;
    $: third = false;
    $: forth = false;
    $: add_mode = false;
    
    $: visible = false;
    
    onMount(() => {
        if (title.length >= 30) {
            TITLE.innerHTML = title.slice(0, 30) + '...';
        } else {
            TITLE.innerHTML = title;
        }
    })
    
    function bubbleUpAddMode() {
        dispatch('add-meme', {
            meme_id: meme_id,
            add_mode: true
        })
    }
    
    
    
    

</script>


<div class="home-container">
    <div class="blog-header">
        <div class="bloggers">
          <div class="blogger-default blogger">
              {blogger}
          </div>
        </div>
        <div class="title-date-dm-container">
            <div class="title-date-wrap">
                <div class="title-wrap" on:click={() => {visible = true; setTimeout(() => {visible = false}, 8000)}}>
                    <div class="title-container-long" bind:this={TITLE}>
                        {title}
                    </div>
                </div>
                <div class="date-wrap">
                    {date}
                </div> 
            </div>
            <div class="dm-wrap">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="27" height="27" viewBox="0 0 1584.000000 1584.000000"
 preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,1584.000000) scale(0.100000,-0.100000)"
fill="#59545f" stroke="none">
                        <path d="M7210 15188 c-167 -19 -310 -145 -397 -352 -100 -236 -218 -746 -238
-1031 -4 -44 -10 -84 -15 -89 -6 -6 -94 31 -227 96 -469 228 -647 289 -853
290 -107 1 -123 -1 -224 -36 -60 -20 -139 -41 -175 -46 -107 -17 -210 -49
-306 -95 -136 -65 -135 -62 -141 -246 -6 -173 3 -254 55 -459 40 -154 85 -284
163 -463 43 -98 58 -141 50 -149 -6 -6 -104 -14 -249 -19 -131 -4 -265 -10
-298 -13 -33 -4 -134 -13 -225 -22 -209 -20 -259 -31 -455 -104 -88 -32 -322
-117 -520 -189 -731 -263 -937 -348 -1375 -567 -658 -329 -885 -488 -983 -689
-58 -117 -68 -152 -71 -245 -3 -73 -8 -95 -39 -160 -69 -146 -123 -386 -221
-980 -173 -1047 -211 -1340 -266 -2020 -11 -135 -31 -380 -45 -545 -13 -165
-31 -406 -40 -535 -8 -129 -17 -266 -20 -305 -14 -206 -20 -724 -20 -1615 1
-1049 7 -1241 46 -1449 49 -255 152 -477 286 -617 92 -96 129 -104 179 -39 14
19 31 35 38 35 11 0 106 -177 106 -198 0 -6 -13 -38 -29 -72 -37 -77 -46 -142
-31 -217 46 -226 252 -353 660 -407 163 -22 581 -71 810 -96 431 -46 772 -92
1175 -156 685 -110 684 -110 945 -138 146 -17 364 -36 755 -67 244 -19 720
-59 1180 -99 127 -11 345 -29 485 -40 140 -11 302 -24 360 -30 58 -6 195 -19
305 -30 177 -17 404 -41 665 -71 479 -53 940 -59 1877 -23 l153 6 47 -42 c128
-113 206 -134 653 -182 192 -20 781 -17 936 5 245 34 411 93 544 193 53 39 84
53 168 76 151 41 226 82 707 385 260 163 575 343 1415 806 80 44 195 108 256
143 61 35 117 64 124 64 8 0 39 -17 70 -39 69 -48 116 -63 194 -64 201 -2 360
203 380 489 3 43 8 504 12 1024 3 520 10 1157 14 1415 4 259 8 916 9 1460 1
992 7 1299 36 1775 24 392 32 618 34 940 1 165 10 422 21 585 26 376 25 583
-1 881 -24 267 -28 234 39 354 136 244 41 525 -220 653 -140 68 -338 112 -688
152 -80 9 -242 32 -361 50 -319 50 -613 87 -979 124 -128 13 -416 34 -850 61
-179 11 -377 25 -440 30 -488 43 -1449 112 -1880 135 -128 7 -160 13 -160 29
0 6 44 99 98 206 183 365 308 731 357 1045 25 156 17 373 -18 506 -85 327
-301 555 -597 634 -98 25 -294 31 -410 11 -380 -66 -784 -334 -1150 -761 -52
-60 -101 -110 -109 -110 -10 0 -29 45 -61 140 -56 167 -83 232 -162 389 -177
352 -422 634 -616 706 -72 27 -160 37 -242 28z m823 -1035 c36 -41 20 -92 -40
-133 -67 -45 -262 -264 -283 -317 -5 -12 -21 -41 -37 -65 -15 -24 -38 -65 -51
-93 -31 -65 -74 -150 -89 -178 -11 -19 -10 -24 5 -37 52 -43 216 -275 224
-316 4 -20 28 -32 28 -13 0 12 20 60 60 144 11 22 24 51 30 65 5 14 14 32 19
40 5 8 22 40 36 70 38 76 92 148 124 164 14 7 39 10 56 6 51 -10 40 -64 -48
-244 -41 -83 -89 -185 -107 -226 -18 -41 -36 -79 -40 -85 -4 -5 -13 -26 -19
-46 -6 -20 -20 -53 -31 -74 -11 -22 -20 -45 -20 -53 0 -8 -7 -26 -15 -40 -17
-33 -78 -215 -100 -300 -9 -34 -13 -77 -10 -95 3 -18 -1 -57 -8 -87 -10 -44
-17 -56 -38 -64 -34 -11 -75 -1 -84 21 -30 74 -23 160 32 366 20 75 33 140 29
144 -4 4 -36 8 -71 8 -134 2 -284 94 -313 191 -20 68 -15 174 13 271 24 80 52
155 75 193 5 8 48 92 95 185 48 94 105 199 127 235 76 122 258 324 324 359 49
25 106 27 127 4z m2321 -274 c19 -15 26 -30 26 -53 0 -49 -27 -67 -122 -82
-65 -10 -107 -25 -193 -68 -221 -112 -440 -258 -584 -392 -143 -132 -131 -116
-113 -149 21 -41 20 -279 -3 -385 -22 -104 -66 -194 -107 -220 -31 -20 -42
-21 -199 -15 -171 6 -229 14 -254 35 -18 15 -18 15 -157 -170 -111 -149 -131
-169 -167 -170 -51 0 -76 55 -51 112 41 91 225 328 439 568 110 122 443 456
531 531 181 155 360 274 575 384 155 79 196 92 291 94 48 1 67 -4 88 -20z
m-4608 -341 c11 -13 26 -36 35 -53 87 -161 138 -246 237 -390 65 -95 217 -300
232 -315 3 -3 28 -32 55 -65 96 -115 130 -151 300 -320 179 -177 201 -197 325
-305 41 -36 77 -68 80 -71 3 -3 50 -39 105 -81 118 -89 133 -104 141 -145 8
-42 -22 -73 -72 -73 -62 0 -292 184 -622 499 -198 188 -309 312 -540 606 -73
92 -255 377 -313 490 -33 64 -60 132 -65 160 -6 43 -4 51 16 67 30 24 62 23
86 -4z m1036 -60 c54 -43 261 -339 302 -432 51 -116 55 -231 7 -231 -19 0 -43
31 -135 175 -98 153 -158 240 -198 289 -72 87 -96 162 -62 195 19 19 64 21 86
4z m-151 -674 c89 -26 216 -94 254 -136 36 -39 47 -89 23 -104 -31 -19 -103
-5 -192 39 -51 25 -120 51 -156 57 -86 16 -106 25 -125 53 -19 30 -5 79 28 95
33 16 106 14 168 -4z m-1348 -417 c12 -13 71 -78 130 -145 136 -152 211 -222
357 -331 205 -155 350 -238 575 -331 135 -55 145 -63 145 -105 0 -48 -29 -75
-80 -75 -22 0 -48 4 -58 9 -9 5 -46 21 -82 37 -219 92 -386 187 -572 325 -213
158 -528 496 -528 567 0 67 68 96 113 49z m4442 -478 c143 -4 310 -13 370 -19
99 -10 493 -52 605 -65 25 -3 119 -12 210 -20 618 -57 742 -72 1160 -137 249
-39 434 -64 635 -88 551 -64 618 -74 745 -115 58 -18 146 -45 195 -60 225 -66
302 -107 328 -175 23 -57 7 -93 -64 -141 -34 -23 -70 -50 -81 -61 -30 -30
-167 -122 -223 -150 -77 -39 -231 -86 -331 -102 -102 -16 -107 -16 -389 49
-544 124 -748 167 -810 171 -38 2 -180 11 -315 20 -269 16 -533 44 -710 74
-216 36 -589 81 -1165 140 -165 17 -365 37 -445 46 -236 24 -498 44 -600 44
-246 0 -384 107 -385 295 0 154 110 268 285 294 79 11 627 11 985 0z m-5075
-49 c293 -18 487 -38 738 -75 145 -21 229 -72 280 -169 22 -42 27 -65 27 -126
0 -65 -4 -82 -30 -128 -76 -138 -200 -176 -490 -153 -248 21 -1781 43 -2060
30 -131 -5 -183 12 -267 89 -92 85 -116 156 -86 255 17 55 106 150 173 182 92
46 301 73 590 76 99 2 257 8 350 15 213 14 585 16 775 4z m3563 -136 c103 -35
174 -135 198 -281 16 -96 0 -171 -52 -250 -64 -97 -271 -300 -422 -414 -204
-153 -251 -183 -367 -232 -85 -36 -113 -44 -150 -40 -109 10 -344 46 -449 69
-222 48 -237 74 -126 224 65 87 164 189 320 328 72 64 132 119 135 122 62 66
412 322 540 395 130 74 185 94 261 95 36 0 86 -7 112 -16z m6974 -412 c84 -43
140 -128 150 -227 10 -98 -61 -222 -161 -280 -23 -13 -90 -45 -151 -71 -147
-62 -153 -65 -434 -198 -134 -64 -245 -116 -248 -116 -10 0 -347 -173 -423
-217 -47 -28 -150 -88 -230 -135 -606 -354 -807 -467 -1042 -584 -103 -52
-189 -98 -193 -103 -3 -5 -1 -21 5 -36 34 -89 29 -267 -14 -585 -28 -202 -33
-270 -42 -550 -3 -113 -7 -225 -9 -250 -2 -25 -6 -153 -10 -285 -3 -132 -12
-460 -20 -730 -11 -361 -12 -589 -6 -865 5 -206 7 -463 5 -570 -15 -885 -23
-1182 -44 -1535 -45 -762 -49 -1026 -25 -1540 33 -693 16 -851 -100 -971 -68
-69 -139 -93 -222 -74 -68 15 -130 62 -161 122 -25 48 -28 75 -46 368 -3 47
-14 207 -26 355 -11 149 -24 335 -29 415 -11 174 -6 859 8 1090 44 709 60
1556 49 2490 -3 250 -2 529 2 620 4 91 11 298 14 460 4 162 11 399 16 525 6
127 14 349 20 495 10 272 16 343 49 560 11 69 22 168 26 220 9 137 22 196 63
273 57 107 74 101 -314 108 -562 11 -1050 57 -1442 135 -325 64 -444 153 -430
320 6 72 44 126 114 160 49 24 65 26 158 26 58 -1 187 -8 288 -16 605 -51 822
-60 1368 -58 479 1 521 -2 599 -44 24 -13 49 -24 57 -24 27 0 398 210 1049
593 331 195 460 265 705 377 69 32 168 78 220 103 52 25 149 70 215 102 251
118 390 171 470 177 59 4 127 -8 172 -30z m-13647 -657 c63 -3 180 -10 260
-16 80 -5 435 -14 790 -19 355 -5 715 -13 800 -19 85 -6 272 -18 415 -26 143
-9 361 -24 485 -35 124 -10 284 -22 355 -25 251 -11 564 -30 700 -40 238 -19
576 -47 770 -64 434 -38 919 -67 1275 -76 118 -4 292 -13 385 -21 196 -16 419
-18 520 -4 39 6 178 14 310 20 132 5 297 14 368 21 160 16 217 6 297 -50 76
-53 105 -111 105 -206 -1 -81 -21 -128 -82 -188 -100 -101 -242 -134 -638
-149 -437 -16 -786 -17 -980 -3 -99 8 -279 14 -400 13 l-220 0 70 -22 c39 -13
88 -34 110 -48 51 -32 121 -108 165 -178 18 -30 49 -72 68 -94 66 -75 76 -112
81 -301 9 -376 6 -444 -30 -785 -27 -254 -85 -721 -113 -901 -84 -556 -167
-1518 -190 -2210 -16 -467 -13 -2071 4 -2339 23 -361 43 -587 71 -815 21 -166
23 -318 4 -381 -30 -108 -85 -172 -190 -226 -33 -16 -73 -40 -90 -53 -75 -56
-170 -89 -304 -106 -251 -31 -389 -11 -551 81 -47 27 -104 51 -127 55 -94 15
-195 106 -223 203 -6 20 -15 111 -20 202 -5 91 -15 248 -22 350 -7 121 -11
422 -10 865 2 595 6 728 27 1065 14 212 32 457 40 545 9 88 20 210 26 270 5
61 18 187 29 280 23 199 37 403 45 640 16 464 61 893 159 1535 25 162 52 342
61 400 100 699 183 1081 310 1430 9 25 43 100 75 168 49 102 70 134 122 186
113 111 212 163 333 174 88 7 55 16 -97 26 -505 31 -630 39 -813 57 -547 51
-840 76 -1050 89 -526 30 -702 43 -920 65 -216 22 -421 38 -840 65 -169 11
-545 27 -825 35 -113 3 -227 8 -255 10 -27 3 -113 10 -190 16 -404 31 -713 91
-825 160 -112 69 -140 205 -61 300 52 62 138 90 256 83 33 -2 112 -6 175 -9z
m12884 -502 c107 -39 186 -147 205 -284 10 -76 -3 -622 -18 -724 -5 -38 -13
-144 -16 -235 -3 -91 -11 -253 -16 -360 -5 -107 -14 -280 -19 -385 -5 -104
-11 -293 -15 -420 -8 -343 -18 -550 -37 -790 -7 -87 -10 -379 -9 -765 2 -722
-2 -776 -94 -1455 -57 -424 -80 -607 -95 -765 -5 -58 -18 -195 -29 -305 -25
-250 -38 -455 -46 -705 -18 -597 -46 -744 -162 -850 -67 -61 -138 -86 -220
-76 -75 9 -126 37 -206 115 -78 75 -111 126 -126 192 -11 47 -19 968 -9 985 3
5 9 90 13 189 3 98 8 182 10 185 2 3 6 116 10 250 6 248 28 601 45 720 13 94
21 710 25 1888 2 568 6 1036 9 1041 3 4 6 91 6 194 1 102 8 275 15 384 8 109
16 236 19 283 3 47 12 180 20 295 8 116 20 300 26 410 29 537 35 595 71 690
11 29 38 71 61 95 42 42 126 90 160 90 10 0 61 24 115 53 54 30 112 59 128 65
46 16 125 14 179 -5z"/>
                    </g>
                </svg>
            </div>
        </div>
        {#if visible}
            <div class='extended-title' transition:fly={{duration: 300, x: 0, y: 0, opacity: 0}}>
                <h3 class="title">{title}</h3>
            </div>
        {/if}
    </div>
    <div class="blog">
        <img src={blog} class="sample">
    </div>
    {#if add_mode == false} 
    <div class="memes" transition:fade={{duration: 200, easing: quintOut}}>
        <div class="first-meme" on:click={() => {first = true; second = third = forth = false; setTimeout(() => {first = false}, 2000)}}>
            <img src="/icons/svgs/star.svg" height="100%">
            {#if first}
                <div class="meme" transition:fade={{duration: 200}}>
                    <img src="/icons/svgs/Dm.svg" height="30">
                    <a>
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30" height="30" viewBox="0 0 792.000000 792.000000"
 preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
fill="#f5f5f5" stroke="none">
                                <path d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"/>
                                <path d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"/>
                                <path d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"/>
                            </g>
                        </svg>
                    </a>
                </div>
            {/if}
        </div>
        <div class="second-meme" on:click={() => {second = true; first = third = forth = false; setTimeout(() => {second = false}, 2000)}}>
            {#if second}
                <div class="meme" transition:fade={{duration: 200}}>
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30" height="30" viewBox="0 0 792.000000 792.000000"
 preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
fill="#f5f5f5" stroke="none">
                            <path d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"/>
                            <path d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"/>
                            <path d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"/>
                        </g>
                    </svg>
                </div>
            {/if}
        </div>
        <div class="third-meme" on:click={() => {third = true; second = first = forth = false; setTimeout(() => {third = false}, 2000)}}>
            {#if third}
                <div class="meme" transition:fade={{duration: 200}}>
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30" height="30" viewBox="0 0 792.000000 792.000000"
 preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
fill="#f5f5f5" stroke="none">
                            <path d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"/>
                            <path d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"/>
                            <path d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"/>
                        </g>
                    </svg>
                </div>
            {/if}
        </div>
        <div class="forth-meme" on:click={() => {forth = true; second = third = first = false; setTimeout(() => {forth = false}, 2000)}}>
            {#if forth}
                <div class="meme" transition:fade={{duration: 200}}>
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="30" height="30" viewBox="0 0 792.000000 792.000000"
 preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
fill="#f5f5f5" stroke="none">
                            <path d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"/>
                            <path d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"/>
                            <path d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"/>
                        </g>
                    </svg>
                </div>
            {/if}
        </div>
        <div class="add-meme">
            <a on:click={() => {add_mode = true;}}>
                <img src="/icons/svgs/addWithOutBorder.svg" height="40">
            </a>
        </div>
    </div>
    {:else}
    <div class="show-memes" transition:slide={{delay:200, duration:400, easing:quintOut}}>
        {#each memes as meme}
            <div class="rest-meme" transition:scale={{delay:600, duration:400, easing:quintOut, start: 0.5, opacity: 0}}>
                <img src="/icons/svgs/star.svg" height="100%">
            </div>
        {:else}
            <div class="no-meme-placeholder">
                <h3>Add a first meme!</h3>
            </div>
        {/each}
        <div class="add-meme-in-show-meme">
            <a on:click={bubbleUpAddMode}>
                <img src="/icons/svgs/addWithOutBorder.svg" height="30">
            </a>
            <a>
                <img src="/icons/svgs/more.svg" height="30">
            </a>
        </div>
    </div>
    {/if}
</div>   