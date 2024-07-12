import { createClient } from "next-sanity";

export const client = createClient({
    projectId:"wxsf9ums",
    dataset: "production",
    useCdn:true,
    apiVersion:"2024-07-11",
    token:"skftVJxhKlZOnRvP5jLQi3hY4e20YZ4rbd925CBkGQDv1WOC8eGBv6bfYuMtAuO7wdgyJCXgTUnJ8ftgooAYrkVfjaSPxIJmjlZ7biUUAiFOGzFwd2IJ6tWVJSxmgApfpyF4giQMz2vogpHJtAOlUiWgaccy3vK01KM3BehOS1PnEq0T6VmW" 
})