import { useState } from 'react'

export default function RespondBox() {

    return (
        <>
            <div id="respond-box">
                <table>
                    <tr>
                        <th>Query</th>
                        <th>Respond</th>
                        <th>Explain</th>
                    </tr>
                    <tr>
                        <td>?</td>
                        <td>LESS</td>
                        <td>Số lượng 'imposter' ít hơn số lượng 'crewmate'</td>
                    </tr>
                    <tr>
                        <td>?</td>
                        <td>MORE</td>
                        <td>Số lượng 'imposter' nhiều hơn số lượng 'crewmate'</td>
                    </tr>
                    <tr>
                        <td>?</td>
                        <td>INVALID</td>
                        <td>Truy vấn không hợp lệ</td>
                    </tr>

                        {/* NOTE: truy vấn có dạng `? a b c`, chứa ba nguyên phân biệt và cách nhau bằng khoản cách */}
                    {/* </tr> */}
                </table>
            </div>
        </>
    )

}