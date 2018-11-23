// valued added service
// 1. chat history export to json or csv file
// 2. user list export to csv file
// 3. accessiable to whitelist user page
// 4. broadcast
// 5. campaign

//
// Service plan
// BASIC: All services but no 1, 2, 3, 4, 5
// BASIC+: All services but  no 2, 3, 4, 5
// PREMIUM: All services but no 4, 5 (TRIAL account default setting) 
// PREMIUM+: All services


// ADMIN: All services + modify staff plan in  CS UI



export type AuthGroup = 'BASIC' | 'BASIC+' | 'PREMIUM'| 'PREMIUM+'| 'ADMIN';