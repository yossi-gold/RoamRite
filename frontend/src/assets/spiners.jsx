import { ClipLoader, BeatLoader, BounceLoader, CircleLoader, ClimbingBoxLoader, DotLoader, FadeLoader, GridLoader, HashLoader, MoonLoader, PacmanLoader, PropagateLoader, PuffLoader, PulseLoader, RingLoader, RiseLoader, RotateLoader, ScaleLoader, SyncLoader } from 'react-spinners'; // Or choose another spinner!

import './spin.css';
export function Spinners() {
    return (<>
    <div className='spinner-header'>
          <h2>Spinner Examples</h2>
    </div>
      

        <div className='spinner-container' style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', border: '2px solid #ccc', padding: '20px', }}>

            <div><p>1</p>


                <div className='spinn'>
                    <ClipLoader color="#007bff" size={15} />


                </div>
            </div>
            
            <div><p>2</p>
                <div className='spinn'>
                    <BeatLoader color="#b5327fff" size={15} />


                </div>
            </div>
            <div><p>3</p>
                <div className='spinn'>
                    <BounceLoader color="#dd8d73ff" size={15} />
                </div>


            </div>
            <div><p>4</p>

                <div className='spinn'>
                    <CircleLoader color="#ff5500ff" size={15} />
                </div>

            </div>
            <div><p>5</p>
                <div className='spinn'>
                    <ClimbingBoxLoader color="#04ff00ff" size={15} />
                </div>

            </div>
            <div><p>6</p>
                <div className='spinn'>

                    <DotLoader color="#aef459ff" size={15} />
                </div>
            </div>
            <div><p>7</p>
                <div className='spinn'>
                    <FadeLoader color="#ff00bfff" size={15} />
                </div>
            </div>
            <div><p>8</p>
                <div className='spinn'>
                    <GridLoader color="#ffb300ff" size={15} />
                </div>

            </div>
            <div><p>9</p>
                <div className='spinn'>
                    <HashLoader color="#ff0000ff" size={15} />
                </div>

            </div>
            <div><p>10</p>
                <div className='spinn'>
                    <MoonLoader color="#051b32ff" size={15} />
                </div>

            </div>
            <div><p>11</p>
                <div className='spinn'>
                    <RotateLoader color="#d752c3ff" size={15} />
                </div>

            </div>
            <div><p>12</p>
                <div className='spinn'>
                    <PropagateLoader color="#8b7912ff" size={15} />
                </div>

            </div>
            <div><p>13</p>
                <div className='spinn'>
                    <PuffLoader color="#7b2137ff" size={15} />
                </div>

            </div>
            <div><p>14</p>
                <div className='spinn'>
                    <PulseLoader color="#2c8b50ff" size={15} />
                </div>

            </div>
            <div><p>15</p>
                <div className='spinn'>
                    <RingLoader color="#8b442cea" size={15} />
                </div>

            </div>
            <div><p>16</p>
                <div className='spinn'>

                    <ScaleLoader color="#169c0ff5" size={15} />
                </div>
            </div>
            <div><p>17</p>
                <div className='spinn'>
                    <SyncLoader color="#0c0c0cff" size={15} />
                </div>

            </div>
            <div><p>18</p>
                <div className='spinn'>

                    <PacmanLoader color="#8c61deff" size={15} />
                </div>
            </div>
            <div><p>19</p>
                <div className='spinn'>
                    <MoonLoader color="#08140fe0" size={15} />

                </div>  </div>

            <div>
                <p>20</p>
                <div className='spinn'>

                    <RiseLoader color="#19c4c4ff" size={15} />
                </div>
            </div>




        </div>
    </>)
}