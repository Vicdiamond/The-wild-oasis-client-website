import Image from 'next/image'
import Link from 'next/link'
import Navigation from './_components/Navigation'
import bg from '@/public/bg.png'

export default function Page () {
  return (
    <main className='mt-24'>
      <Image
        src={bg}
        alt='Mountains and forests with two cabins'
        fill
        className='object-cover object-top'
        placeholder='blur'
        quality={80}
      />

      <div className='relative z-10 text-center'>
        <h1 className='text-8xl text-primary-50 mb-10 tracking-tight font-normal'>
          Welcome to paradise.
        </h1>
        <Link
          href='/cabins'
          className='bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all'
        >
          Explore luxury cabins
        </Link>
      </div>
    </main>
  )
}

// 32

// 425: React server components (RSC)

// In react where there is 100% client side rendering, we can imagine the ui to be a function of  a state changing overtime. one disadvantage to this is client data waterfalls,i.e different components may need different data fetching which will causesome kind of too much client server interaction that is bad for performances
// But when there is 100% server side rendering the ui is a function of data gotten from the server
// So in order to take advantage from the two, i.e how interactive the 100%client side apps are and how easy to get data in the 100%server side apps, then we have RSC

// Rsc is a completely new full-stack architecture for react apps
//It introduces the server as an integral part of the react component tree, it bridges the gap between client and the server by introducing a new kind of component i.e server component

// The name rsc is the name of the whole new paradigm while server components is the new type of component that rsc introduces. They are components that are only rendered on the server and never on the client. Their goal is to make part of the ui a function of data. And since they are rendderd on the server, they have no interactivity and require no js downloadable bundle to the client
// Then apart from the server components, we also have the client component, that are regular components that the ui is a function of the state changes
//

// So together, they make writing frontend code next to backend code in a natural way that feels like react

// in addition, server components are the default type of component in rsc. We need to specifically tell a component to use client if we want it to be a client component

// children component of a parent component, that is a client component does not need to specify to be a client component, since the parent component is a client one. because they are already in a server-client boundary. So these server-client boundaries marks the split point between client and server code

// Server components vs client components
// Server components are the default type of component in rsc paradigm. And we need to opt into the client component by writing 'use client'
// Since client components are the interactive ones, they are the only ones that can use state and hooks, while server components cannot be stateful or use any kind of hooks
// we can pass props in client components and we can also do that in server compoennts, also between server and client components, and between server components just that the props must be serializable i.e they must be converted to a format that can easily be transferred. Functions and classes are examples of datastructures thatare not serializable

// in data fetching, we can use async await right at the top level of the server component that is not possible in the client component. We can also fetch data in the client component but with the use of a libarary like react query

// In importing components we must take note of components that are imported just using the import synatax, or components that are imported to render the jsx of that component

// So, server componentscan import bothclient and server component while client components can omly import other client component and not server components. (i.e on the import just using the import syntax, not that we want to render anything from the imported component)
// But client component can render server components passed as props, and server component can render anything

// in rerendring, a client component rerenders when its state changes, while server component gets executed again each time the url changes
// client and server components are connnected by props

// ////////////////////////////////////////////////////////

// 430 RSC VS SSR
// rsc is not the same thing as ssr, they are completely different technologies
// The server in react server component and the server in ssr are not the same thing. the server in rsc can simply b just another computer that is different from the one clients

// ssr works completly withour server components

// how rsc rendering works simply is all the server components gets rendered on the server and shipped off to the browser. then rhe react bundle that makes interactiveness to happen also needs to be sent and when they are both sent to the client, hydration happens on the browser before the whole react app starts working

// ssr only happens on the initial render

// 447 React suspense

// Suspense is a built in react component that we can use to catch or isolate components that are not ready to be rendered

// Two things that could cause a component to be suspended are fetching data with a supported libarary that supports suspense and lazy code loading with react

// 453 STATIC VS DYNAMIC SSR

// Remember: both server and client component are initially rendered on the server
// It is not the entire app that is rendered statically or dynamically. its the individual route of the app that can be rendered staatically or dynamically
// we do not choose what route should be rendered dynamically or statically

// STATIC
// In static rendering, the html is generated at build time meaning the html is rendered just once at build time
// This is useful when the data does not change much often and it is not personalized to the user
// By default all routes are rendered statically in nextjs even when a page or component is fetching some kind of data

// DYNAMIC
// This means the html is generated at request time meaning it is generated for each new request that hits the server, \
// And this makes sense if the data changes frequently and it is personalized to the user
// Route that are renderered dynamically become a serverless function
// And also when rendering a route requires information from the request
// A route automatically switch to dynamic rendering under some certain conditions
// // If the route contains a dynamic segment (page uses params)
// // If the componentis using searchParam
// // If any of the routes reads incoming headers or cookies
// // An uncached data request is made in any of the route server component. But this gives us a way to force nextjs to render a route dynamically by manipulating the way fetched request are cached

// Terminologies related to this topic
// CDN: (content delivery network).It is a network of servers that are located around the globe that cached and deliver a website static content and they deliver the contentt to each user from a server located closest to the user

// Severless computing: this means running a single function on the cloud and the server is not being managed by ourselves. the server is only active only for the duration that the serverless function is running

// The 'edge': this is something that happens as close as possible to the user. a cdn is part of an edge network. there is also serverless edge computing

// ISR ( incremental static generation): a feature of nextjs that allows developers to update the conent of a static page in the background even when the site has been built and deployed

// 457 PARTIAL PRE-RENDERING

// This is when nextjs combines both dynamic and static rendering to the same route

// 458 caching

// caching means taking data that has already been fetched or computed and storing them in a temporary location for future access
// Nextjs caching is very aggressive, everything that is possible to be cached will be cached
// Nextjs provides api for revalidating cache, simply removing data from cache and updating it with fresh data

// They are four caching mechanisms, 3 are related to the server while one on the client

// 1) request memoization (server): - this basically allows us to fetch the same data in multiple components or places with making only one fetch request. this onnly works when the request is the same; meaning the same url and options object

// 2) data cache (server): this is data fetched in a route or single fetch request and the data will be cached indefinately unless we manually invalidate the cache. it is data for static pages

// 3) full route cache (server): this is basically building static pages once and storing them as html and rsc payload and it ispersisted until the dara cache is cleared
// 4) Router cache (client): this is used to store all the prefetched pages and all the pages that the user have visited while navigating around. there is no way to revalidate this cache and pages are stored for 30secs for dynamic pages and 5min for static pages, it can cause displaying stale data

// All this caching does not happen in development and only on production

// How we can revalidate or opt out of the diferent caching mechanisms
// 1) Request memoization: There is no way of revalidating this cache but we can opt out using the abortcontroller using the fetch function. But all these are generally not needed

// 2 & 3) Data cache, full route cache : We can set this to be revalidated after a certain amount of time has passed, we can do this by exporting a revalidate const this will hold the amount of seconds the data should be cleared from the cache and refetched. Or we can use a revalidatePath or revalidateTag function and this will also revalidate the full route cache. We can opt out by setting the exported revalidate const to 0 or using export const dynamic ='force-dynamic"

// 4) Router cache: You can use revalidatePath or revalidateTag to revalidate as long as it been done in a server action (SA). you can also use router.refresh or cookies.set or cookies.delete in a SA. And it is not possible to opt out of this cache

// 462
// Dependency tree shows what modules that are imported by other modules
// in react server components, its in the dependency tree thats where the client server boundaries are established and not in the component tree
// client components cannot import server components but can render server components, as long as they are passed in by props. when a client component imports a server component, that component will be rendered as a client component
// Server components can render and import all kind of components

// Components create instances when they are used, so one component can be a server component at one instance and be a client component at another instance

// 463

// Always try to render server components as low as possible in the component tree

// 465
// When passing data from a client component to a server component, we can pass it through the state in the url
// So in the page.js (NOT SERVER COMPONENT) we get access to the search params ONLY in the page.js in a route

// All page navigations are automatically wrapped in transistions in nextjs so in that case suspense will not rerender the fallback but we fix that by passing a unique key to the fallback,so when the key changes the fallback component will be shown  i.e like a spinner

// 473 WHAT IS MIDDLEWARE IN NEXTJS

// in nextjs, middleware is a function that sits between an incoming request and response. In other words, middleware in nextjs helps us to write some code based on the incoming request before the response

// by default, middleware runs before every single route in our app

// Only one middleware function needs to be exported from middleware.js in the project route folder
// USE CASES
// 1. To read and set incoming cookies and headers and this enables us to implement features such as
// a. Authetication and authorization
// b. Server-side analytics
// c. reidirect based on geolocation e.t.c

// The middleware function always needs to produce a response
// One way to produce a respose, is to redirect or rewrite to a route in our app
// And the second way  is to directly send a json response to the client

// 479  WHAT ARE SERVER ACTIONS

// They are async functions that runs exclusively on the server allowing us to perform data mutations
// They are created with a 'use server' directive either at the top of an async function in a server component or the top of a module

// 1) Server can be defined right inside a server component where they can be used directly or be passed into a client component. We cant pass normal functions as prop into a client component but we can pass functions that are sever actions

// 2) Another place it can be created is in a dedicated standalone moudle which needs to start with the 'use server' directive, then all functions that we export from that file simply becomes server actions which can be imported into any server or client component, this is the recommenend

// The 'use server' directive is only for server actions and not server components

// Codes written with 'use server' cannot get to the client
// Server action requires a running webserver

// we can use the server action in an action attribute in a form element be it server or client component
// They can be called in event handlers or useEffects but this can only work in client components as only client components can be interactive

// In server actions we can
// 1) Perform data mutation (Create, update, delete) data
// 2) Update the UI with new data by revalidating cache, revalidatetag
// 3) we can also work with cookies and many more...

// Server actions code is running on the backend, so we need to assume inputs are unsafe
