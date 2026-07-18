import React from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
import { useCallback, useState } from "react";
import { useEffect } from "react";
const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/")
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();

    const pokeFun = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(url);
            setNextUrl(res.data.next);
            setPrevUrl(res.data.previous);
            getPokemon(res.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [url]);

    const getPokemon = async (res) => {
        try {
            const results = await Promise.all(
                res.map((item) => axios.get(item.url))
            );
            const newData = results.map((r) => r.data);

            setPokeData((state) => {
                const updated = [...state, ...newData];
                updated.sort((a, b) => (a.id > b.id ? 1 : -1));
                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        pokeFun();
    }, [url, pokeFun])
    return (
        <>
            <div className="container">
                <div className="left-content">
                    <Card pokemon={pokeData} loading={loading} infoPokemon={poke => setPokeDex(poke)} />

                    <div className="btn-group">
                        {prevUrl && <button onClick={() => {
                            setPokeData([])
                            setUrl(prevUrl)
                        }}>Previous</button>}

                        {nextUrl && <button onClick={() => {
                            setPokeData([])
                            setUrl(nextUrl)
                        }}>Next</button>}

                    </div>
                </div>

                <div className="right-content">
                    <Pokeinfo data={pokeDex} />
                </div>
            </div>
        </>
    )
}
export default Main;