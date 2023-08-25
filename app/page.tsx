import Link from "next/link"

interface ServerInfo {
  addr: string
  gameport: number
  steamid: string
  name: string
  appid: number
  gamedir: string
  version: string
  product: string
  region: number
  players: number
  max_players: number
  bots: number
  map: string
  secure: boolean
  dedicated: boolean
  os: string
  gametype: string
}

async function fetchServerInfo(): Promise<ServerInfo | null> {
  return fetch(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${process.env.API_STEAM_KEY}&filter=addr\\${process.env.RUST_SERVER_ADDR}`)
    .then(res => {
      if (res.status !== 200) {
        return null
      }
      return res.json()
    })
    .then(json => {
      if (json.response.servers === undefined || json.response.servers.length === 0) {
        return null
      }
      return json.response.servers[0]
    })
}

export default async function Home() {
  const serverInfo = await fetchServerInfo()

  return (
    <main className="text-stone-800 flex flex-col gap-6">
      <div className="text-3xl">Rust herní server</div>
      <div className="flex flex-wrap gap-1 max-w-3xl">
        <div>Pro přístup na herní server je nutná registrace přes <Link href={process.env.REMOTE_WHITELIST_INVITE_LINK!} target="_blank" className="text-blue-600 underline underline-offset-2">odkaz</Link>, pomocí Steam účtu. Tím se zapíšete na whitelist, kdy po schválení administrátorem získáte přístup a budete se moc připojit.</div>
        <div>Server je vanilla a jsou nainstalovány jen pluginy pro správu a administraci <Link href={"https://github.com/choodiesam/umod-remote-whitelist"} target="_blank" className="text-blue-600 underline underline-offset-2 whitespace-nowrap">Remote Whitelist</Link>.</div>
      </div>
      <div className="flex flex-col gap-1 w-56">
        <div className="text-2xl">Herní server</div>
        <div className="bg-stone-100 rounded-xl shadow p-2 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold">Název</div>
            <div>{serverInfo?.name}</div>
            <div className="text-sm font-bold">Adresa</div>
            <div>{serverInfo?.addr}</div>
            <div className="text-sm font-bold">Maximální počet hráčů</div>
            <div>{serverInfo?.max_players}</div>
          </div>
        </div>
      </div>
      <div>
        <Link href={process.env.DISCORD_INVITE_LINK!} target="_blank">
          <div className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-xl p-2 w-28 text-center text-xl">Discord</div>
        </Link>
      </div>
    </main>
  )
}
